const mongoose = require('mongoose'),
	PathPart = require('./PathPart');

var Flight = new mongoose.Schema({
	path: [ PathPart ],
	price: Number,
	capacity: Number
});

module.exports = mongoose.model('Flight', Flight);