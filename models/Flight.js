const mongoose = require('mongoose'),
	moment = require('moment'),
	lastModified = require('./plugins/lastModified'),
	PathPart = require('./PathPart'),
	Carrier = require('./Carrier'),
	User = require('./User');

var Flight = new mongoose.Schema({
	path: [ PathPart.schema ],
	price: Number,
	capacity: Number,
	note: String,
	freeCapacity: Number,
	passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

	// generovane hodnoty pri ulozeni modelu
	fromDestination: String,
	toDestination: String,
	arrivalTime: Date,
	departureTime: Date,
	transfersCount: Number,
	totalFlightDuration: Number	// v minutach
});

Flight.plugin(lastModified);

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

	// volna mista
	this.freeCapacity = this.capacity - this.passengers.length;

	// pocet prestupu
	this.transfersCount = this.path.length > 1 ?  this.path.length - 1 : 0;

	// celkova delka letu
	this.totalFlightDuration = moment(this.arrivalTime).diff(this.departureTime, 'minutes');

	next();
});

// Zeserializuje object a prida k nemu kontextova data (napr. dataq z aktualniho usera)
Flight.methods.serializeWithContext = function (user) {
	var data = this.toObject();

	if (user) {
		data['hasReservation'] = this.passengers.some(function (passenger) {
			return passenger.equals(user._id);
		});
	}

	return data;
};

Flight.methods.addReservationForUser = function (user, callback) {
	var passengers = this.passengers,
		self = this,
		reservationAlreadyExists = passengers.some(function (passenger) {
			return passenger.equals(user._id);
		}), errors = [];

	if (reservationAlreadyExists) {
		errors.push('Nelze vytvořit rezervaci, která už byla vytvořena.');

		callback(errors, this);
	}
	else {
		if (this.freeCapacity > 0) {
			passengers.push(user._id);

			this.save(function (err, data) {
				if (!err) {
					callback(null, self);
				}
				else {
					callback([{
						type: 'error',
						message: err.toString()
					}], null);
				}
			});
		}
		else {
			errors.push('Let je již plně obsazen. Nelze vytvořit rezervaci.');
			callback(errors, this);
		}
	}
};

Flight.methods.cancelReservationForUser = function (user, callback) {
	var passengers = this.passengers,
		self = this,
		reservationAlreadyExists = passengers.some(function (passenger) {
			return passenger.equals(user._id);
		}), errors = [];

	if (reservationAlreadyExists) {
		passengers.remove(user._id)

		this.save(function (err, data) {
			if (!err) {
				callback(null, self);
			}
			else {
				callback([{
					type: 'error',
					message: err.toString()
				}], null);
			}
		});
	}
	else {
		errors.push('Nelze zrušit rezervaci, která neexistuje.');
		callback(errors, this);
	}
};

Flight.statics.filter = function (filter, pagerSorter, callback) {
	var query = this.count({});
	pagerSorter || (pagerSorter = {});

	// vyfiltrovani podle kriterii
	if (filter) {
		if (filter.fromDestination) {
			query.where('fromDestination').equals(filter.fromDestination);
		}

		if (filter.toDestination) {
			query.where('toDestination').equals(filter.toDestination);
		}

		if (filter.maxTransfersCount !== undefined) {
			query.where('transfersCount').lte(filter.maxTransfersCount);
		}

		if (filter.departureTimeFrom) {
			query.where('departureTime').gte(new Date(filter.departureTimeFrom));
		}

		if (filter.departureTimeTo) {
			query.where('departureTime').lte(new Date(filter.departureTimeTo));
		}

		if (filter.arrivalTimeFrom) {
			query.where('arrivalTime').gte(new Date(filter.arrivalTimeFrom));
		}

		if (filter.arrivalTimeTo) {
			query.where('arrivalTime').lte(new Date(filter.arrivalTimeTo));
		}

		if (filter.totalFlightDuration) {
			query.where('totalFlightDuration').lte(filter.totalFlightDuration);
		}

		if (filter.priceFrom) {
			query.where('price').gte(filter.priceFrom);
		}

		if (filter.priceTo) {
			query.where('price').lte(filter.priceTo);
		}

		// vyfiltrovani pouze mych rezervaci
		if (filter.userId) {
			query.where('passengers').in([ filter.userId ]);
		}
	}

	query.exec(function (err, totalCount) {
		query.find();

		// strankovani a sortovani
		if (pagerSorter.limit) {
			query.limit(pagerSorter.limit);
		}

		if (pagerSorter.offset) {
			query.skip(pagerSorter.offset);
		}

		if (pagerSorter.sort && pagerSorter.dir) {
			var sortObj = {};
			sortObj[pagerSorter.sort] = pagerSorter.dir;

			query = query.sort(sortObj);
		}

		query.exec(function (err, flights) {
			callback(err, {
				items: flights,
				metadata: {
					totalCount: totalCount
				}
			});
		});
	});
};

var destinations = require('./Destination').getAll();

function getNotUsedItemFromArray (array, excluded) {
	excluded || (excluded = []);

	while (true) {
		var city = getRandomItemFromArray(array);

		if (excluded.indexOf(city) == -1) {
			excluded.push(city);
			return city;
		}
	}
};

function getRandomItemFromArray (array) {
	return array[getRnd(0, array.length)];
};

function generateRandomPath (carriers, pathLen) {
	var pathParts = [],
		previousPathPart = null,
		usedDestinations = [],
		startDate = moment()
			.add('months', getRnd(0, 12))
			.add('days', getRnd(0, 31))
			.add('hours', getRnd(0, 24))
			.add('minutes', getRnd(0, 60));

	for (var i = 0; i < pathLen; i++) {
		var departureTime = !previousPathPart ? startDate : moment(previousPathPart.arrivalTime).add('minutes', getRnd(25, 360));

		var pathPart = new PathPart({
				carrier: getRandomItemFromArray(carriers)._id,
				fromDestination: previousPathPart ? previousPathPart.toDestination : getNotUsedItemFromArray(destinations, usedDestinations),
				toDestination: getNotUsedItemFromArray(destinations, usedDestinations),
				departureTime: departureTime.toDate(),
				arrivalTime: moment(departureTime).add('minutes', getRnd(150, 480)).toDate()
			});

		previousPathPart = pathPart;
		pathParts.push(pathPart);
	}

	return pathParts;
};

function getRnd (from, to, decimal) {
	if (decimal) {
		return Math.random() * to + from;
	}
	else {
		return Math.floor(Math.random() * to) + from;
	}
};

Flight.statics.generate = function (count) {
	var self = this;

	Carrier.find({}, function (err, carriers) {
		if (!err) {

			for (var i = 0; i < count; i++) {
				var pathLen = getRnd(1, 5);

				var flight = new self({
					price: getRnd(10, 999),
					capacity: getRnd(10, 200),
					note: 'Poznamka ze dne ' + moment().format('MMM Do YYYY, hh:mm'),
					passengers: [],
					path: generateRandomPath(carriers, pathLen)
				});

				flight.save();
			}
		}
		else {
			console.log(err);
		}
	});
};

module.exports = mongoose.model('Flight', Flight);
