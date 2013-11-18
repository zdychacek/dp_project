const User = require('../models/User'),
	BAN_PERIOD = 40 * 1000,
	BAD_LOGIN_THRESHOLD = 3;

var filterUser = function (user) {
	if (user) {
		return {
			user: user
		};
	}
	else {
		return {
			user: null
		};
	}
};

var security = {
	authenticationRequired: function (req, res, next) {
		console.log('authRequired');

		if (req.session.user) {
			next();
		}
		else {
			res.json(401, filterUser(req.session.user));
		}
	},

	adminRequired: function (req, res, next) {
		console.log('adminRequired');

		if (req.session.user && req.session.user.admin) {
			next();
		}
		else {
			res.json(401, filterUser(req.session.user));
		}
	},

	sendCurrentUser: function (req, res, next) {
		res.json(200, filterUser(req.session.user));
		res.end();
	},

	login: function (req, res, next) {
		var loginData = req.body;

		User.findOne({
			login: req.body.login
		}, function (err, user) {
			var loggedUser = null;

			if (!err) {
				if (user) {
					if (user.password == req.body.password) {
						if (!user.bannedSince || new Date(user.bannedSince.valueOf() + BAN_PERIOD) < new Date()) {
							user.badLoginCounter = 0;
							user.bannedSince = null;
							loggedUser = user;
						}
					}
					else {
						if (user.badLoginCounter < BAD_LOGIN_THRESHOLD - 1)  {
							user.badLoginCounter++;
						}
						else if (!user.bannedSince) {
							user.bannedSince = new Date();
						}
					}
				}

				// ulozim udaje o badLoginCounteru atd.
				user.save(function (err, user) {
					if (!err) {
						console.log('Saving updated login data', user);

						var errors = [];

						if (user.bannedSince) {
							errors.push({
								type: 'banned',
								data: new Date(user.bannedSince + BAN_PERIOD)
							});
						}

						req.session.user = loggedUser;

						res.json(200, {
							user: loggedUser,
							_errors_: errors
						});
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
	},

	logout: function (req, res, next) {
		if (req.session.user) {
			req.session.user = null;
		}

		res.send(204);
	}
};

module.exports = security;
