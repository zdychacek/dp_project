const User = require('../models/User'),
	async = require('async');

exports.addRoutes = function (app, config) {
	app.namespace('/api/v1/users', function () {

		app.get('/checkLogin', function (req, res) {
			var login = req.query.login;

			User
				.find({ login: login })
				.count(function (err, count) {
					if (err) {
						return console.log(err);
					}

					res.json({
						isValid: count == 0
					});
				});
		});

		app.get('/:id', function (req, res) {
			User.findById(req.params.id, function (err, user) {
				if (!err) {
					res.json(user);
				}
				else {
					console.log(err);
					res.json(null);
				}				
			});
		});

		app.post('/', function (req, res) {
			var user = new User(req.body);

			user.save(function (err, user) {
				if (!err) {
					res.json(user);
				} else { console.log(err); }
			});
		});

		app.delete('/:id', function (req, res) {
			User.remove({ _id: req.params.id }, function (err) {
				if (!err) {
					res.json(null);
				}
				else { console.log(err); }
			});
		});

		app.put('/:id', function (req, res) {
			var userData = req.body,
				id = req.params.id;

			delete userData._id;

			User.findOneAndUpdate({ _id: id }, userData, function (err, user) {
				if (err) {
					console.log(err);
				}

				res.json(user);
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

				var metadata = {
					totalCount: result.totalCount
				};

				res.json({
					items: result.users,
					metadata: metadata
				});
			});
		});
	});
};