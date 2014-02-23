'use strict';

var User = require('../models/User');

function filterUser (user) {
	if (user) {
		// we don't want to send password to client
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
		if (req.session.user) {
			next(null, req.session.user);
		}
		else {
			res.sendData(401, filterUser(req.session.user));
		}
	},

	isAdmin: function (req, res, next) {
		if (req.session.user && req.session.user.isAdmin) {
			next(null, req.session.user);
		}
		else {
			res.sendData(401, filterUser(req.session.user));
		}
	},

	isAdminOrUserWithIdIsLogged: function (userId, req, res, next) {
		if (req.session.user && (req.session.user.isAdmin || req.session.user._id == userId)) {
			next(null, req.session.user);
		}
		else {
			res.sendData(401, filterUser(req.session.user));
		}
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
