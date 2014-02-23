'use strict';

var mongoose = require('mongoose'),
	Carrier = require('./Carrier');

var PathPart = new mongoose.Schema({
	fromDestination: String,
	toDestination: String,
	departureTime: Date,
	arrivalTime: Date,
	carrier: {
		type: mongoose.Schema.ObjectId,
		ref: Carrier
	}
});

module.exports = mongoose.model('PathPart', PathPart);
