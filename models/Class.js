const mongoose = require('mongoose');

var Class = new mongoose.Schema({
	name: String,
	code: String
});

module.exports = mongoose.model('Class', Class);