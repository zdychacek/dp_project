const mongoose = require('mongoose'),
	lastModified = require('./plugins/lastModified');

var User = new mongoose.Schema({
	login: String,
	email: String,
	firstName: String,
	lastName: String,
	isAdmin: Boolean
});

User.plugin(lastModified);

module.exports = mongoose.model('User', User);