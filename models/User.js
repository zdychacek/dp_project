const mongoose = require('mongoose'),
	Q = require('q'),
	async = require('async'),
	Flight = require('./Flight'),
	CallHistoryItem = require('./CallHistoryItem'),
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
	badLoginCounter: { type: Number, default: 0 },

	// history of calls
	callsHistory: [ CallHistoryItem.schema ]
});

User.plugin(lastModified);

User.methods.listReservations = function () {
	return Flight.find({
		passengers: {
			$in: [this._id]
		}
	}).exec();
};

User.methods.cancelAllReservations = function () {
	var deferred = Q.defer(),
		user = this;

	Flight.find({
		passengers: {
			$in: [this._id]
		}
	}, function (err, flights) {
		if (!err) {
			var batch = [];

			flights.forEach(function (flight) {
				flight.passengers.forEach(function (passenger, i) {
					if (passenger.equals(user._id)) {
						flight.passengers.splice(i, 1);
					}
				});

				batch.push(function (cb) {
					flight.save(function (err, data) {
						cb(err, data);
					});
				});
			});

			async.parallel(batch, function (err, data) {
				if (err) {
					deferred.resolve();
				}
				else {
					deferred.reject();
				}
			});
		}
		else {
			deferred.reject(err);
		}
	});

	return deferred.promise;
};

User.methods.isUserBanned = function () {
	return this.bannedSince && new Date(this.bannedSince.valueOf() + User.BAN_PERIOD) > new Date();
};

User.methods.insertCallHistoryItem = function (sessionId, startTime) {
	var deferred = Q.defer(),
		historyItem = new CallHistoryItem({
			sessionId: sessionId,
			startTime: startTime
		});

	this.callsHistory.push(historyItem);

	this.save(function (err, data) {
		if (!err) {
			deferred.resolve(historyItem);
		}
		else {
			deferred.reject(err);
		}
	});

	return deferred.promise;
};

User.methods.commitCallHistoryItem = function (historyItem) {
	var deferred = Q.defer(),
		item = this.callsHistory.id(historyItem._id);

	if (item) {
		item.endTime = new Date();
		this.save(function (err, user) {
			if (!err) {
				deferred.resolve(item);
			} else {
				deferred.reject(err);
			}
		});
	}
	else {
		deferred.reject(new Error('Missing history item.'));
	}

	return deferred.promise;
};

User.statics.BAN_PERIOD = 15 * 1000;
User.statics.BAD_LOGIN_THRESHOLD = 3;

User.statics.tryLogin = function (login, password) {
	var deferred = Q.defer(),
		self = this,
		status = null;

		this.findOne({ login: login }, function (err, user) {
			var loggedUser = null;

			if (!err) {
				if (user) {
					if (user.password == password) {
						if (!user.isEnabled) {
							status = { type: 'disabled' };
						}
						else if (user.isUserBanned()) {
							status = { type: 'banned', data: new Date(user.bannedSince.valueOf() + self.BAN_PERIOD) };
						}
						// logged in
						else {
							user.badLoginCounter = 0;
							user.bannedSince = null;
							loggedUser = user;
						}
					}
					else {
						if (user.isUserBanned()) {
							status = { type: 'banned', data: new Date(user.bannedSince.valueOf() + self.BAN_PERIOD) };
						}
						else if (user.isEnabled) {
							if (++user.badLoginCounter >= self.BAD_LOGIN_THRESHOLD) {
								if (!user.bannedSince) {
									user.bannedSince = new Date();

									status = { type: 'banned', data: new Date(user.bannedSince.valueOf() + self.BAN_PERIOD) };
								}
								else {
									user.badLoginCounter = 1;
									user.bannedSince = null;

									status = { type: 'badLogin' };
								}
							}
							else {
								status = { type: 'badLogin' };
							}
						}
						else {
							status = { type: 'badLogin' };
						}
					}
				}

				// save badLoginCounter state
				if (user) {
					user.save(function (err, user) {
						if (!err) {
							deferred.resolve({
								user: loggedUser,
								status: status
								/*user: null,
								status: {
									type: 'banned',
									data: new Date()
								}*/
							});
						}
						else {
							deferred.reject(err);
						}
					});
				}
				else {
					status = { type: 'badLogin' };
					deferred.resolve({
						user: null,
						status: status
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
