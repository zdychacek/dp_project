const Flight = require('../models/Flight'),
	PathPart = require('../models/PathPart'),
	security = require('../lib/security'),
	async = require('async');

exports.addRoutes = function (app, config, io) {
	app.namespace('/api/v1/flights', function () {

		app.get('/generate/:count', function (req, res) {
			var count = req.params.count;

			Flight.generate(count);

			res.json({
				count: count
			});
		});

		function setReservationState (params /*state = vytvorit novou, flightId, user, res*/) {
			var create = params.state,
				flightId = params.flightId,
				user = params.user,
				res = params.res,
				errors = [];

			function _sendResponse (res, flight, errors) {
				var flightData = flight.serializeWithContext(user);
				errors.length && (flightData._errors_ = errors);

				io.sockets.emit('flight:changed', flightData);
				res.json(flightData)
			};

			function _saveFlightAndSendResponse (res, flight, errors) {
				flight.save(function (err, flight) {
					if (!err) {
						_sendResponse(res, flight, errors);
					}
					else {
						console.log(err);
					}
				});
			};

			function _makeErrorMsg (message) {
				return {
					type: 'error',
					message: message
				};
			};

			Flight.findById(flightId, function (err, flight) {
				if (!err) {
					var passengers = flight.passengers,
						reservationAlreadyExists = flight.passengers.some(function (passenger) {
							return passenger.equals(user._id);
						});

					// rezervace jiz existuje
					if (reservationAlreadyExists) {
						// chystam se vytvorit rezervaci
						if (create) {
							errors.push(_makeErrorMsg('Nelze vytvořit rezervaci, která už byla vytvořena.'));
							_sendResponse(res, flight, errors);
						}
						// chystam se smazat rezervaci
						else {
							passengers.remove(user._id)
							_saveFlightAndSendResponse(res, flight, errors);
						}
					}
					// rezervace NEexistuje
					else {
						if (create) {
							// pridam rezervaci
							passengers.push(user._id);
							_saveFlightAndSendResponse(res, flight, errors);
						}
						else {
							errors.push(_makeErrorMsg('Nelze zrušit rezervaci, která neexistuje.'));
							_sendResponse(res, flight, errors);
						}
					}
				}
				else {
					console.log(err)
				};
			});
		};

		app.get('/make-reservation/:id', function (req, res) {
			security.isAuthorized(req, res, function (user) {
				setReservationState({
					state: true,
					flightId: req.params.id,
					user: user,
					res: res
				});
			});
		});

		app.get('/cancel-reservation/:id', function (req, res) {
			security.isAuthorized(req, res, function (user) {
				setReservationState({
					state: false,
					flightId: req.params.id,
					user: user,
					res: res
				});
			});
		});

		app.get('/delete', function (req, res) {
			var count = req.params.count;

			security.isAdmin(req, res, function () {
				Flight.remove({}, function () {
					res.send('deleted');
				});
			});
		});

		app.get('/:id', function (req, res) {
			security.isAuthorized(req, res, function (user) {
				Flight.findById(req.params.id, function (err, flight) {
					if (!err) {
						res.json(flight.serializeWithContext(user));
					}
					else { console.log(err); }
				});
			});
		});

		app.post('/', function (req, res) {
			security.isAdmin(req, res, function (user) {
				var flight = new Flight(req.body);

				flight.save(function (err, flight) {
					if (!err) {
						var flightData = flight.serializeWithContext(user);
						io.sockets.emit('flight:created', flightData);
						res.json(flightData);
					}
					else { console.log(err); }
				});
			});
		});

		app.delete('/:id', function (req, res) {
			security.isAdmin(req, res, function () {
				Flight.remove({ _id: req.params.id }, function (err) {
					if (!err) {
						io.sockets.emit('flight:deleted', req.params.id);
						res.json(null);
					}
					else { console.log(err); }
				});
			});
		});

		app.put('/:id', function (req, res) {
			security.isAdmin(req, res, function (user) {
				Flight.findById(req.params.id, function (err, flight) {
					if (!err) {
						flight.date = req.body.date;
						flight.price = req.body.price;
						flight.capacity = req.body.capacity;
						flight.note = req.body.note;
						flight.path = req.body.path;

						flight.save(function (err, flight) {
							if (!err) {
								var flightData = flight.serializeWithContext(user);
								io.sockets.emit('flight:changed', flightData);
								res.json(flightData);
							}
							else { console.log(err); }
						});
					}
					else { console.log(err); }
				});
			});
		});

		app.get('/', function (req, res) {
			var filter = {};

			security.isAuthorized(req, res, function (user) {
				if (req.query.filter) {
					try {
						filter = JSON.parse(req.query.filter);
					}
					catch (ex) { }
				}

				var query = Flight.count({});

				// vyfiltrovani podle kriterii
				if (filter.fromDestination) {
					query = query.where('fromDestination').equals(filter.fromDestination);
				}

				if (filter.toDestination) {
					query = query.where('toDestination').equals(filter.toDestination);
				}

				if (filter.maxTransfersCount !== undefined) {
					query = query.where('transfersCount').lte(filter.maxTransfersCount);
				}

				if (filter.departureTimeFrom) {
					query = query.where('departureTime').gte(new Date(filter.departureTimeFrom));
				}

				if (filter.departureTimeTo) {
					query = query.where('departureTime').lte(new Date(filter.departureTimeTo));
				}

				if (filter.arrivalTimeFrom) {
					query = query.where('arrivalTime').gte(new Date(filter.arrivalTimeFrom));
				}

				if (filter.arrivalTimeTo) {
					query = query.where('arrivalTime').lte(new Date(filter.arrivalTimeTo));
				}

				if (filter.totalFlightDuration) {
					query = query.where('totalFlightDuration').lte(filter.totalFlightDuration);
				}

				if (filter.priceFrom) {
					query = query.where('price').gte(filter.priceFrom);
				}

				if (filter.priceTo) {
					query = query.where('price').lte(filter.priceTo);
				}

				// vyfiltrovani pouze mych rezervaci
				if (filter.onlyMyReservation) {
					query.where('passengers').in([ user._id ]);
				}

				query.exec(function (err, totalCount) {
					query.find();

					// strankovani a sortovani
					if (req.query.limit) {
						query = query.limit(req.query.limit);
					}

					if (req.query.offset) {
						query = query.skip(req.query.offset);
					}

					if (req.query.sort && req.query.dir) {
						var sortObj = {};
						sortObj[req.query.sort] = req.query.dir;

						query = query.sort(sortObj);
					}

					query.exec(function (err, flights) {
						if (!err) {
							flights = flights.map(function (flight) {
								return flight.serializeWithContext(user);
							});

							res.json({
								items: flights,
								metadata: {
									totalCount: totalCount
								}
							});
						}
						else { return console.log(err); }
					});
				});
			});
		});
	});
};
