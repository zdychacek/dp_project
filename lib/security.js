const thunkify = require('thunkify'),
	parse = require('co-body'),
	User = require('../models/User');

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
	isAuthorized: function (ctx) {
		console.log('authRequired');

		if (ctx.session.user) {
			return true;
		}
		else {
			return false;
		}
	},

	isAdmin: function (ctx) {
		console.log('adminRequired');

		if (ctx.session.user && ctx.session.user.isAdmin) {
			return true;
		}
		else {
			return false;
		}
	},

	isAdminOrUserWithIdIsLogged: function (userId, ctx) {
		console.log('isAdminOrUserWithIdIsLogged', userId);

		if (ctx.session.user && (ctx.session.user.isAdmin || ctx.session.user._id == userId)) {
			return true;
		}
		else {
			return false;
		}
	},

	sendCurrentUser: function *() {
		this.body = filterUser(this.session.user);
	},

	login: function *() {
		var loginData = yield parse.json(this),
			errors = [],
			loggedUser = null;

		function _createErrorInfo (type, data) {
			return {
				type: type,
				data: data
			}
		};

		var user = yield User.findOne({ login: loginData.login }).exec(),
			save = thunkify(user.save.bind(user));

		if (user) {
			if (user.password == loginData.password) {
				if (!user.isEnabled) {
					errors.push(_createErrorInfo('disabled'));
				}
				else if (user.isBanned()) {
					errors.push(_createErrorInfo('banned', new Date(user.bannedSince.valueOf() + User.BAN_PERIOD)));
				}
				// prihlasen
				else {
					user.badLoginCounter = 0;
					user.bannedSince = null;
					loggedUser = user;
				}
			}
			else {
				if (user.isBanned()) {
					errors.push(_createErrorInfo('banned', new Date(user.bannedSince.valueOf() + User.BAN_PERIOD)));
				}
				else if (user.isEnabled) {
					if (++user.badLoginCounter >= USER.BAD_LOGIN_THRESHOLD) {
						if (!user.bannedSince) {
							user.bannedSince = new Date();

							errors.push(_createErrorInfo('banned', new Date(user.bannedSince.valueOf() + User.BAN_PERIOD)));
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

			// TODO: mongoose doesnt return promise from Model#save
			user = yield save();

			this.session.user = loggedUser;
			this.body = {
				user: loggedUser,
				_errors_: errors
			};
		}
	},

	logout: function *() {
		if (this.session.user) {
			this.session.user = null;
		}

		this.status = 204;
	}
};

module.exports = security;
