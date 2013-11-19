const Flight = require('../models/Flight'),
	PathPart = require('../models/PathPart'),
	async = require('async');

exports.addRoutes = function (app, config, security, io) {
	app.namespace('/api/v1/flights', function () {

		app.get('/generate/:count', function (req, res) {
			var count = req.params.count;

			Flight.generate(count);

			res.json({
				count: count
			});
		});

		app.get('/:id/make-reservation', function (req, res) {
			security.isAuthorized(req, res, function (user) {
				Flight.findById(req.params.id, function (err, flight) {
					if (!err) {
						flight.addReservationForUser(user, function (errors, flight) {
							var data = flight.serializeWithContext(user);

							if (err) {
								data._errors_ = errors.map(function (err) {
									return {
										type: 'error',
										message: err
									};
								});
							}
							else {
								io.sockets.emit('flight:changed', data);
							}

							res.json(data);
						});
					}
					else {
						console.log(err);
					}
				});
			});
		});

		app.get('/:id/cancel-reservation', function (req, res) {
			security.isAuthorized(req, res, function (user) {
				Flight.findById(req.params.id, function (err, flight) {
					if (!err) {
						flight.cancelReservationForUser(user, function (errors, flight) {
							var data = flight.serializeWithContext(user);

							if (err) {
								data._errors_ = errors.map(function (err) {
									return {
										type: 'error',
										message: err
									};
								});
							}
							else {
								io.sockets.emit('flight:changed', data);
							}

							res.json(data);
						});
					}
					else {
						console.log(err);
					}
				});
			});
		});

		app.get('/delete', function (req, res) {
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
			security.isAuthorized(req, res, function (user) {
				var filter = {};

				if (req.query.filter) {
					try {
						filter = JSON.parse(req.query.filter);
					}
					catch (ex) { }
				}

				if (filter.onlyMyReservation) {
					filter.userId = user._id;
				}

				Flight.filter(filter, req.query, function (err, result) {
					if (!err) {
						result.items = (result.items || []).map(function (flight) {
							return flight.serializeWithContext(user);
						})
						res.json(result);
					}
					else {
						console.log(err);
					}
				});
			});
		});
	});
};
