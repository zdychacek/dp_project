const User = require('../models/User'),
	async = require('async');

exports.addRoutes = function (app, config) {
	app.namespace('/api/v1', function () {

		app.get('/users/generate/:count', function (req, res) {
			var count = req.params.count;

			User.generateTestData(count);

			res.json({count: count});
		});

		app.delete('/users/:id/disconnectAccount', function (req, res) {
			var user = new User(request.body);
			user.disconnected = true;

			user.save(function (err, savedUser) {
				if (err) {
					console.log(err);
				}

				res.json(savedUser);
			});
		});

		app.get('/users/:id', function (req, res, next) {
			var id = req.params.id;

			User.findOne({ _id: id }, function (err, user) {
				if (err) {
					console.log(err);
				}

				res.json(user);
			});
		});

		app.post('/users', function (req, res) {
			var userData = req.body,
				id = userData._id;

			delete userData._id;

			if (id) {
				User.update({_id: id}, userData, {upsert: true}, function (err, user) {
					if (err) {
						console.log(err);
					}

					res.json(user);
				});
			}
		});

		app.get('/users', function (req, res) {
			var offset = req.query.offset,
				limit = req.query.limit ? req.query.limit : 9999,
				sort = req.query.sort || '_id',
				dir = req.query.dir || 'asc',
				sortObj = {};

			sortObj[sort] = dir;

			async.parallel({
				totalCount: function (callback) {
					User
						.find({})
						.count(function (err, count) {
							callback(err, count);
						});
				},
				users: function (callback) {
					User
						.find({})
						.limit(limit)
					    .skip(offset)
					    .sort(sortObj)
					    .exec(function (err, users) {
							callback(err, users);
						});
				}
			}, function (err, result) {
				if (err) {
					return console.log(err);
				}

				res.set({
					'total-count': result.totalCount
				});
				res.json(result.users);
			});			
		});
	});
};