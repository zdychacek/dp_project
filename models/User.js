const mongoose = require('mongoose'),
	Q = require('q'),
	Flight = require('./Flight'),
	lastModified = require('./plugins/lastModified');

var User = new mongoose.Schema({
	login: String,
	firstName: String,
	lastName: String,
	email: String,
	isAdmin: { type: Boolean, default: false },
	password: String,
	isEnabled: { type: Boolean, default: true },
	bannedSince: Date,
	badLoginCounter: Number
});

User.plugin(lastModified);

User.methods.listReservations = function () {
	return Flight.find({
		passengers: {
			$in: [this._id]
		}
	}).exec();
};

User.methods.isUserBanned = function () {
	return this.bannedSince && new Date(this.bannedSince.valueOf() + User.BAN_PERIOD) > new Date();
};

User.statics.BAN_PERIOD = 15 * 1000;
User.statics.BAD_LOGIN_THRESHOLD = 3;

User.statics.tryLogin = function (login, password) {
	var deferred = Q.defer(),
		self = this,
		errors = [];

		this.findOne({ login: login }, function (err, user) {
			var loggedUser = null;

			if (!err) {
				if (user) {
					if (user.password == password) {
						if (!user.isEnabled) {
							errors.push({ type: 'disabled' });
						}
						else if (user.isUserBanned()) {
							errors.push({ type: 'banned', data: new Date(user.bannedSince.valueOf() + self.BAN_PERIOD)});
						}
						// prihlasen
						else {
							user.badLoginCounter = 0;
							user.bannedSince = null;
							loggedUser = user;
						}
					}
					else {
						if (user.isUserBanned()) {
							errors.push({ type: 'banned', data: new Date(user.bannedSince.valueOf() + self.BAN_PERIOD)});
						}
						else if (user.isEnabled) {
							if (++user.badLoginCounter >= self.BAD_LOGIN_THRESHOLD) {
								if (!user.bannedSince) {
									user.bannedSince = new Date();

									errors.push({ type: 'banned', data: new Date(user.bannedSince.valueOf() + self.BAN_PERIOD)});
								}
								else {
									user.badLoginCounter = 1;
									user.bannedSince = null;

									errors.push({type: 'badLogin' });
								}
							}
							else {
								errors.push({type: 'badLogin' });
							}
						}
						else {
							errors.push({type: 'badLogin' });
						}
					}
				}

				// ulozim udaje o badLoginCounteru atd.
				if (user) {
					user.save(function (err, user) {
						if (!err) {
							deferred.resolve({
								user: loggedUser,
								errors: errors
							});
						}
						else {
							deferred.reject(err);
						}
					});
				}
				else {
					errors.push({type: 'badLogin' });
					deferred.resolve({
						user: null,
						errors: errors
					});
				}
			}
			else {
				deferred.reject(err);
			}
	});

	return deferred.promise;
};

module.exports = mongoose.model('User', User);
