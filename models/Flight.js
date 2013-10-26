const mongoose = require('mongoose'),
	Carrier = require('./Carrier'),
	Class = require('./Class'),
	Transfer = require('./Transfer');

var Flight = new mongoose.Schema({
	carrier: {
		type: mongoose.Schema.ObjectId,
		ref: Carrier
	},
	fromDestination: String,
	toDestination: String,
	departureTime: Date,
	arrivalTime: Date,
	'class': {
		type: mongoose.Schema.ObjectId,
		ref: Class
	},
	transfers: [ Transfer ],
	price: Number,
	capacity: Number
});

module.exports = mongoose.model('Flight', Flight);