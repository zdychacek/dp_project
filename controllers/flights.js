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
			async.parallel({
				totalCount: function (callback) {
					Flight
						.find({})
						.count(function (err, count) {
							callback(err, count);
						});
				},
				data: function (callback) {
					var query = Flight.find({});

					if (typeof req.query.limit === 'number') {
						query = query.limit(req.query.limit);
					}

					if (typeof req.query.offset === 'number') {
						query = query.skip(req.query.offset);
					}

					if (req.query.sort && req.query.dir) {
						var sortObj = {};
						sortObj[req.query.sort] = req.query.dir;

						query = query.sort(sortObj);
					}

					query.exec(function (err, flights) {
						callback(err, flights);
					});
				}
			}, function (err, result) {
				if (!err) {
					res.json({
						items: result.data,
						metadata: {
							totalCount: result.totalCount
						}
					});
				}
				else { return console.log(err); }
			});
		});
	});
};
