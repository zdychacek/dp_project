const User = require('../models/User'),
	BAN_PERIOD = 15 * 1000,
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
		var loginData = req.body,
			errors = [];

		function _isUserBanned (user) {
			return user.bannedSince && new Date(user.bannedSince.valueOf() + BAN_PERIOD) > new Date();
		};

		function _createErrorInfo (type, data) {
			return {
				type: type,
				data: data
			}
		};

		User.findOne({
			login: req.body.login
		}, function (err, user) {
			var loggedUser = null;

			if (!err) {
				if (user) {
					if (user.password == req.body.password) {
						if (!user.isEnabled) {
							errors.push(_createErrorInfo('disabled'));
						}
						else if (_isUserBanned(user)) {
							errors.push(_createErrorInfo('banned', new Date(user.bannedSince.valueOf() + BAN_PERIOD)));
						}
						// prihlasen
						else {
							user.badLoginCounter = 0;
							user.bannedSince = null;
							loggedUser = user;
						}
					}
					else {
						if (_isUserBanned(user)) {
							errors.push(_createErrorInfo('banned', new Date(user.bannedSince.valueOf() + BAN_PERIOD)));
						}
						else if (user.isEnabled) {
							if (++user.badLoginCounter >= BAD_LOGIN_THRESHOLD) {
								if (!user.bannedSince) {
									user.bannedSince = new Date();

									errors.push(_createErrorInfo('banned', new Date(user.bannedSince.valueOf() + BAN_PERIOD)));
								}
								else {
									user.badLoginCounter = 1;
									user.bannedSince = null;

									errors.push(_createErrorInfo('badLogin'));
								}
							}
							else {
								errors.push(_createErrorInfo('badLogin'));
							}
						}
						else {
							errors.push(_createErrorInfo('badLogin'));
						}
					}
				}

				// ulozim udaje o badLoginCounteru atd.
				user.save(function (err, user) {
					if (!err) {
						console.log('Saving updated login data', user);

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
