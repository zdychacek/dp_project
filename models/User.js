const mongoose = require('mongoose'),
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

User.statics = {
	BAN_PERIOD: 15 * 1000,
	BAD_LOGIN_THRESHOLD: 3
};

User.methods.listReservations = function (callback) {
	Flight.find({
		passengers: {
			$in: [this._id]
		}
	}, function (err, flights) {
		callback.apply(null, arguments);
	});
};

User.methods.isBanned = function () {
	return this.bannedSince && new Date(this.bannedSince.valueOf() + User.BAN_PERIOD) > new Date();
};

module.exports = mongoose.model('User', User);
