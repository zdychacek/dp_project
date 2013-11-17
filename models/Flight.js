const mongoose = require('mongoose'),
	PathPart = require('./PathPart'),
	User = require('./User'),
	moment = require('moment'),
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
	arrivalTime: Date,
	departureTime: Date,
	transfersCount: Number,
	totalFlightDuration: Number	// v minutach
});

Flight.plugin(lastModified);

function parseTime (time) {
	var splitted = time.split(':');

	return splitted[0] * 60 + (+splitted[1]);
}

Flight.pre('save', function (next) {
	var firstPathPart = this.path[0],
		lastPathPart = this.path.length > 1 ? this.path[this.path.length - 1] : this.path[0];

	if (firstPathPart) {
		this.fromDestination = firstPathPart.fromDestination;
		this.departureTime = firstPathPart.departureTime;
	}
	else {
		this.fromDestination = null;
		this.departureTime = null;
	}

	if (lastPathPart) {
		this.toDestination = lastPathPart.toDestination;
		this.arrivalTime = lastPathPart.arrivalTime;
	}
	else {
		this.toDestination = null;
		this.arrivalTime = null;
	}

	// pocet prestupu
	this.transfersCount = this.path.length > 1 ?  this.path.length - 1 : 0;

	// celkova delka letu
	this.totalFlightDuration = moment(this.arrivalTime).diff(moment(this.departureTime), 'minutes');

	console.log('totalFlightDuration', this.totalFlightDuration);

	next();
});

module.exports = mongoose.model('Flight', Flight);
