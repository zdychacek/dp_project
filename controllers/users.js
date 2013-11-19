const User = require('../models/User'),
	Flight = require('../models/Flight'),
	async = require('async');

exports.addRoutes = function (app, config, security) {
	app.namespace('/api/v1/users', function () {

		app.get('/checkLogin', function (req, res) {
			security.isAuthorized(req, res, function () {
				var login = req.query.login;

				User.find({
					login: login
				}).count(function (err, count) {
					if (err) {
						return console.log(err);
					}

					res.json({
						isValid: count == 0
					});
				});
			});
		});

		app.get('/:id/list-reservations', function (req, res) {
			security.isAdminOrUserWithIdIsLogged(req.params.id, req, res, function (user) {
				User.findById(req.params.id, function (err, user) {
					if (!err) {
						user.listReservations(function (err, flights) {
							if (!err) {
								res.sendData(flights);
							}
							else {
								console.log(err);
							}
						});
					}
					else {
						console.log(err);
					}
				});
			});
		});

		app.get('/:id', function (req, res) {
			security.isAuthorized(req, res, function () {
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
		});

		app.post('/', function (req, res) {
			security.isAdmin(req, res, function () {
				var user = new User(req.body);

				user.save(function (err, user) {
					if (!err) {
						res.json(user);
					} else { console.log(err); }
				});
			});
		});

		app.delete('/:id', function (req, res) {
			security.isAdmin(req, res, function () {
				User.remove({ _id: req.params.id }, function (err) {
					if (!err) {
						res.json(null);
					}
					else { console.log(err); }
				});
			});
		});

		app.put('/:id', function (req, res) {
			security.isAuthorized(req, res, function () {
				var errors = [];

				User.findById(req.params.id, function (err, user) {
					var originalUser = user.toObject();

					if (!err) {
						user.email = req.body.email;
						user.firstName = req.body.firstName;
						user.lastName = req.body.lastName;
						user.login = req.body.login;
						user.isAdmin = req.body.isAdmin;

						if (req.body.isEnabled !== undefined) {
							user.isEnabled = req.body.isEnabled;
						}

						var oldPassword = req.body.oldPassword,
							passwordConfirmaton = req.body.passwordConfirmaton;

						if (oldPassword !== undefined && passwordConfirmaton !== undefined) {
							if (oldPassword === user.password) {
								console.log('Changing password from', oldPassword, ' to ', req.body.password)
								user.password = req.body.password;
							}
							else {
								errors.push({
									type: 'error',
									message: 'Zadali jste špatné původní heslo. Změna hesla se nezdařila.'
								});
							}
						}

						// nastali chyby
						if (errors.length) {
							originalUser['_errors_'] = errors;
							res.json(originalUser);
						}
						// vse probehlo v poradku
						else {
							user.save(function (err, user) {
								if (!err) {
									res.json(user);
								}
								else { console.log(err); }
							});
						}
					}
					else { console.log(err); }
				});
			});
		});

		app.get('/', function (req, res) {
			security.isAdmin(req, res, function () {
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
	});
};
