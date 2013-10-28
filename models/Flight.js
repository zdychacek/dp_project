const mongoose = require('mongoose'),
	PathPart = require('./PathPart');

var Flight = new mongoose.Schema({
	path: [ PathPart ],
	date: Date,
	price: Number,
	capacity: Number,
	note: String
});

module.exports = mongoose.model('Flight', Flight);