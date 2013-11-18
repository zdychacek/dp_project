const Flight = require('../models/Flight'),
	PathPart = require('../models/PathPart'),
	async = require('async');

exports.addRoutes = function (app, config) {
	app.namespace('/api/v1/flights', function () {

		app.get('/generate/:count', function (req, res) {
			var count = req.params.count;

			Flight.generate(count);

			res.json({
				count: count
			});
		});

		app.get('/delete', function (req, res) {
			var count = req.params.count;

			Flight.remove({}, function () {
				res.send('deleted');
			});
		});

		app.get('/:id', function (req, res) {
			Flight.findById(req.params.id, function (err, flight) {
				if (!err) {
					res.json(flight);
				}
				else { console.log(err); }
			});
		});

		app.post('/', function (req, res) {
			var flight = new Flight(req.body);

			flight.save(function (err, flight) {
				if (!err) {
					res.json(flight);
				}
				else { console.log(err); }
			});
		});

		app.delete('/:id', function (req, res) {
			Flight.remove({ _id: req.params.id }, function (err) {
				if (!err) {
					res.json(null);
				}
				else { console.log(err); }
			});
		});

		app.put('/:id', function (req, res) {
			Flight.findById(req.params.id, function (err, flight) {
				if (!err) {
					flight.date = req.body.date;
					flight.price = req.body.price;
					flight.capacity = req.body.capacity;
					flight.note = req.body.note;
					flight.path = req.body.path;

					flight.save(function (err, flight) {
						if (!err) {
							res.json(flight);
						}
						else { console.log(err); }
					});
				}
				else { console.log(err); }
			});
		});

		app.get('/', function (req, res) {
			var filter = {};

			if (req.query.filter) {
				try {
					filter = JSON.parse(req.query.filter);
				}
				catch (ex) { }
			}

			console.log(filter);

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
};
