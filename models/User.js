const mongoose = require('mongoose'),
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

User.pre('save', function (next) {
	if (this.isEnabled) {
		//this.bannedSince = null;
	}

	next();
});

module.exports = mongoose.model('User', User);
