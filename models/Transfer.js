const mongoose = require('mongoose'),
	Carrier = require('./Carrier');

var Transfer = new mongoose.Schema({
	fromDestination: String,
	toDestination: String,
	departureTime: Date,
	arrivalTime: Date,
	carrier: {
		type: mongoose.Schema.ObjectId,
		ref: Carrier
	}
});

module.exports = mongoose.model('Transfer', Transfer);