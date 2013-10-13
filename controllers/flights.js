const Flight = require('../models/Flight'),
	async = require('async');

exports.addRoutes = function (app, config) {
	app.namespace('/api/v1/flights', function () {

		app.get('/:id', function (req, res, next) {
			var id = req.params.id;

			Flight.findOne({ _id: id }, function (err, flight) {
				if (err) {
					console.log(err);
				}

				res.json(flight);
			});
		});

		app.post('/', function (req, res) {
			var flightData = req.body,
				newFlight = new Flight(flightData);

			newFlight.save(function (err, flight) {
				if (err) {
					console.log(err);
				}

				res.json(flight);
			});
		});

		app.delete('/:id', function (req, res) {
			var id = req.params.id;

			Flight.remove({ _id: id }, function (err) {
				if (err) {
					console.log(err);
				}

				res.json(null);
			});
		});

		app.put('/', function (req, res) {
			var flightData = req.body,
				id = flightData._id;

			delete flightData._id;

			Flight.findOneAndUpdate({ _id: id }, flightData, function (err, flight) {
				if (err) {
					console.log(err);
				}

				res.json(flight);
			});
		});

		app.get('/', function (req, res) {
			var offset = req.query.offset,
				limit = req.query.limit ? req.query.limit : 9999,
				sort = req.query.sort || '_id',
				dir = req.query.dir || 'asc',
				sortObj = {};

			sortObj[sort] = dir;

			async.parallel({
				totalCount: function (callback) {
					Flight
						.find({})
						.count(function (err, count) {
							callback(err, count);
						});
				},
				flights: function (callback) {
					Flight
						.find({})
						.limit(limit)
					    .skip(offset)
					    .sort(sortObj)
					    .exec(function (err, flights) {
							callback(err, flights);
						});
				}
			}, function (err, result) {
				if (err) {
					return console.log(err);
				}

				res.set({
					'total-count': result.totalCount
				});
				res.json(result.flights);
			});			
		});
	});
};