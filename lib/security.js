const User = require('../models/User'),
	BAN_PERIOD = 15 * 1000,
	BAD_LOGIN_THRESHOLD = 3;

var filterUser = function (user) {
	if (user) {
		// na klienta nebudeme posilat heslo
		delete user.password;

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
	isAuthorized: function (req, res, next) {
		console.log('authRequired');

		if (req.session.user) {
			next(null, req.session.user);
		}
		else {
			res.sendData(401, filterUser(req.session.user));
		}
	},

	isAdmin: function (req, res, next) {
		console.log('adminRequired');

		if (req.session.user && req.session.user.isAdmin) {
			next(null, req.session.user);
		}
		else {
			res.sendData(401, filterUser(req.session.user));
		}
	},

	isAdminOrUserWithIdIsLogged: function (userId, req, res, next) {
		console.log('isAdminOrUserWithIdIsLogged', userId);

		if (req.session.user && (req.session.user.isAdmin || req.session.user._id == userId)) {
			next(null, req.session.user);
		}
		else {
			res.sendData(401, filterUser(req.session.user));
		}
	},

	getCurrentUser: function () {
		return req.session.user;
	},

	sendCurrentUser: function (req, res, next) {
		res.sendData(200, filterUser(req.session.user));
		res.end();
	},

	login: function (req, res) {
		return User.tryLogin(req.body.login, req.body.password)
			.then(function (result) {
				req.session.user = result.user;
				res.sendData(200, {
					user: result.user,
					_errors_: [ result.status ]
				});
			})
	},

	logout: function (req, res, next) {
		if (req.session.user) {
			req.session.user = null;
		}

		res.send(204);
	}
};

module.exports = security;
