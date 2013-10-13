const mongoose = require('mongoose'),
	Carrier = require('./Carriers'),
	Class = require('./Class');

var FlightFilter = new mongoose.Schema({
	oneWay: Boolean,
	fromDestination: String,
	toDestination: String,
	departureDate: Date,
	arrivalDate: Date,
	prefferedCarrier: [ Carrier ],
	'class': Class,
	price: Number,
	capacity: Number,
	passagersCount: Number,
	onlyDirectFlight: Boolean
});

module.exports = mongoose.model('FlightFilter', FlightFilter);