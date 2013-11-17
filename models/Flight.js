const mongoose = require('mongoose'),
	PathPart = require('./PathPart'),
	User = require('./User'),
	lastModified = require('./plugins/lastModified');

var Flight = new mongoose.Schema({
	path: [ PathPart.schema ],
	price: Number,
	capacity: Number,
	note: String,
	// TODO: passangers
	passengers: [ User.schema ],

	// generovane hodnoty pri ulozeni modelu
	fromDestination: String,
	toDestination: String,
	arrivalDate: Date,
	departureDate: Date,
	transfersCount: Number,
	totalFlightDuration: Number	// v minutach
});

Flight.plugin(lastModified);

function parseTime (time) {
	var splitted = time.split(':');

	return splitted[0] * 60 + (+splitted[1]);
}

Flight.pre('save', function (next) {
	console.log('Flight', this);

	var firstPathPart = this.path[0],
		lastPathPart = this.path.length > 1 ? this.path[this.path.length - 1] : this.path[0],
		startTime = 0,
		endTime = 0;

	if (firstPathPart) {
		this.fromDestination = firstPathPart.fromDestination;
		this.departureTime = firstPathPart.departureTime;
		//startTime = parseTime(firstPathPart.departureTime);
	}
	else {
		this.fromDestination = '';
		this.departureTime = '';
	}

	if (lastPathPart) {
		this.toDestination = lastPathPart.toDestination;
		this.arrivalTime = lastPathPart.arrivalTime;
		//endTime = parseTime(lastPathPart.arrivalTime);
	}
	else {
		this.toDestination = '';
		this.arrivalTime = '';
	}

	// pocet prestupu
	this.transfersCount = this.path.length > 1 ?  this.path.length - 1 : 0;

	// celkova delka letu
	this.totalFlightDuration = endTime - startTime;

	next();
});

module.exports = mongoose.model('Flight', Flight);
