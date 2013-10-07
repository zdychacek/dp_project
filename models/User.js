const mongoose = require('mongoose'),
	lastModified = require('./plugins/lastModified');

var User = new mongoose.Schema({
	login: String,
	firstName: String,
	lastName: String,
	email: String,
	isAdmin: Boolean,
	password: String
});

User.plugin(lastModified);

module.exports = mongoose.model('User', User);