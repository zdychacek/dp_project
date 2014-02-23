'use strict';

var User = require('../models/User'),
	Flight = require('../models/Flight'),
	Q = require('q'),
	async = require('async'),
	suspend = require('suspend');

exports.addRoutes = function (app, config, security) {
	app.namespace('/api/v1/users', function () {

		app.get('/checkLogin', function (req, res) {
			suspend(function*(resume) {
				try {
					yield security.isAuthorized(req, res, resume);

					var login = req.query.login,
						count = yield User.find({ login: login }).count().exec();

					res.sendData({
						isValid: count == 0
					});
				}
				catch (ex) {
					console.log(ex);
				}
			})();
		});

		app.get('/:id/list-reservations', function (req, res) {
			suspend(function* (resume) {
				try {
					yield security.isAdminOrUserWithIdIsLogged(req.params.id, req, res, resume);

					var user = yield User.findById(req.params.id).exec(),
						flights = yield user.listReservations();

					res.sendData(flights);
				}
				catch (ex) {
					console.log(ex);
				}
			})();
		});

		function asyncCallback(gen) {
			return function() {
				return Q.async(gen).apply(null, arguments).done();
			};
		}

		app.get('/:id', function (req, res) {
			suspend(function* (resume) {
				try {
					yield security.isAuthorized(req, res, resume);

					res.sendData(yield User.findById(req.params.id).exec());
				}
				catch (ex) {
					console.log(ex);
				}
			})();
		});

		app.post('/', function (req, res) {
			suspend(function* (resume) {
				try {
					yield security.isAdmin(req, res, resume);

					var user = new User(req.body);
					user = yield user.save(resume);
					res.sendData(user);
				}
				catch (ex) {
					console.log(ex);
				}
			})();
		});

		app.delete('/:id', function (req, res) {
			suspend(function* (resume) {
				try {
					yield security.isAdmin(req, res, resume);

					yield User.remove({ _id: req.params.id }, resume);
					res.sendData(null);
				}
				catch (ex) {
					console.log(ex);
				}
			})();
		});

		app.put('/:id', function (req, res) {
			suspend(function* (resume) {
				try {
					yield security.isAuthorized(req, res, resume);

					var errors = [],
						user = yield User.findById(req.params.id, resume),
						originalUser = user.toObject();

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
							user.password = req.body.password;
						}
						else {
							errors.push({
								type: 'error',
								message: 'Zadali jste špatné původní heslo. Změna hesla se nezdařila.'
							});
						}
					}

					// nastaly chyby
					if (errors.length) {
						originalUser._errors_ = errors;
						res.sendData(originalUser);
					}
					// vse probehlo v poradku
					else {
						res.sendData(yield user.save(resume));
					}
				}
				catch (ex) {
					console.log(ex);
				}
			})();
		});

		app.get('/', function (req, res) {
			suspend(function* (resume) {
				try {
					yield security.isAdmin(req, res, resume);

					var offset = req.query.offset,
						limit = req.query.limit,
						sort = req.query.sort,
						dir = req.query.dir;

					var result = yield async.parallel({
						totalCount: function (callback) {
							User.find({})
								.count(callback);
						},
						users: function (callback) {
							var query = User.find({});

							if (limit) {
								query.limit(limit);
							}

							if (offset) {
							    query.skip(offset);
							}

							if (sort && dir) {
								var sortObj = {};
								sortObj[sort] = dir;

								query.sort(sortObj);
							}

						    query.exec(callback);
						}
					}, resume);

					res.sendData({
						items: result.users,
						metadata: {
							totalCount: result.totalCount
						}
					});
				}
				catch (ex) {
					console.log(ex);
				}
			})();
		});
	});
};
