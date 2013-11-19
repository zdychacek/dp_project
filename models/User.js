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

User.methods.listReservations = function (callback) {
	Flight.find({
		passengers: {
			$in: [this._id]
		}
	}, function (err, flights) {
		callback.apply(null, arguments);
	});
};

module.exports = mongoose.model('User', User);
