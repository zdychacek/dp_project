const mongoose = require('mongoose'),
	moment = require('moment'),
	lastModified = require('./plugins/lastModified'),
	PathPart = require('./PathPart'),
	Carrier = require('./Carrier'),
	User = require('./User');

var FlightSchema = new mongoose.Schema({
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

FlightSchema.plugin(lastModified);

FlightSchema.pre('save', function (next) {
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

/*
	{
	  'capacity': 100,
	  'note': '',
	  'price': 10,
	  'passengers': [],
	  'path': [
	    {
	      'arrivalTime': '2013-11-18T05:25:00.000Z',
	      'carrier': '5287920ac5fb006956000002',
	      'departureTime': '2013-11-17T13:05:00.000Z',
	      'fromDestination': 'Praha',
	      'toDestination': 'Mexiko'
	    }
	  ]
	}
*/

var destinations = ['Abu Dhabi','Abuja','Accra','Adamstown, Pitcairn Island','Addis Ababa','Algiers','Alofi','Amman','Amsterdam','Andorra la Vella','Ankara','Antananarivo','Apia','Ashgabat','Asmara','Astana','Asunción','Athens','Avarua','Baghdad','Baku','Bamako','Bandar Seri Begawan','Bangkok','Bangui','Banjul','Basseterre','Beijing','Beirut','Belgrade','Belmopan','Berlin','Bern','Bishkek','Bissau','Bogotá','Brasília','Bratislava','Brazzaville','Bridgetown','City of Brussels','Bucharest','Budapest','Buenos Aires','Bujumbura','Cairo','Canberra','Caracas','Castries','Cayenne','Charlotte Amalie, United States Virgin Islands','Chisinau','Cockburn Town','Conakry','Copenhagen','Dakar','Damascus','Dhaka','Dili','Djibouti (city)','Dodoma','Doha','Douglas, Isle of Man','Dublin','Dushanbe','Edinburgh of the Seven Seas','El Aaiún','Episkopi Cantonment','Flying Fish Cove','Freetown','Funafuti','Gaborone','George Town, Cayman Islands','Georgetown, Ascension Island','Georgetown, Guyana','Gibraltar','Grytviken','Guatemala City','Gustavia, Saint Barthélemy','Hagåtña','Hamilton, Bermuda','Hanga Roa','Hanoi','Harare','Hargeisa','Havana','Helsinki','Honiara','Islamabad','Jakarta','Jamestown, Saint Helena','Jerusalem','Jerusalem','Juba','Kabul','Kampala','Kathmandu','Khartoum','Kiev','Kigali','Kingston, Jamaica','Kingston, Norfolk Island','Kingstown, Saint Vincent and the Grenadines','Kinshasa','Kuala Lumpur','Kuwait City','Libreville','Lilongwe','Lima','Lisbon','Ljubljana','Lomé','London','Luanda','Lusaka','Luxembourg (city)','Madrid','Majuro','Malabo','Malé','Managua','Manama','Manila','Maputo','Marigot, Saint Martin','Maseru','Mata-Utu','Mbabane','Melekeok','Mexico City','Minsk','Mogadishu','Monaco','Monrovia','Montevideo','Moroni, Comoros','Moscow','Muscat, Oman','Nairobi','Nassau, Bahamas','Naypyidaw','N\'Djamena','New Delhi','Niamey','Nicosia','Nicosia','Nouakchott','Nouméa','Nukuʻalofa','Nuuk','Oranjestad, Aruba','Oslo','Ottawa','Ouagadougou','Pago Pago','Palikir','Panama City','Papeete','Paramaribo','Paris','Philipsburg, Sint Maarten','Phnom Penh','Plymouth, Montserrat','Podgorica','Port Louis','Port Moresby','Port Vila','Port-au-Prince','Port of Spain','Porto-Novo','Prague','Praia','Pretoria','Pristina','Pyongyang','Quito','Rabat','Reykjavík','Riga','Riyadh','Road Town','Rome','Roseau','Saipan','San José, Costa Rica','San Juan, Puerto Rico','City of San Marino','San Salvador','Sana\'a','Santiago','Santo Domingo','São Tomé','Sarajevo','Seoul','Singapore','Skopje','Sofia','Sri Jayawardenepura Kotte','St. George\'s, Grenada','St. Helier','St. John\'s, Antigua and Barbuda','St. Peter Port','St. Pierre, Saint-Pierre and Miquelon','Stanley, Falkland Islands','Stepanakert','Stockholm','Sucre','Sukhumi','Suva','Taipei','Tallinn','Tarawa','Tashkent','Tbilisi','Tegucigalpa','Tehran','Thimphu','Tirana','Tiraspol','Tokyo','Tórshavn','Tripoli','Tskhinvali','Tunis','Ulan Bator','Vaduz','Valletta','The Valley, Anguilla','Vatican City','Victoria, Seychelles','Vienna','Vientiane','Vilnius','Warsaw','Washington, D.C.','Wellington','West Island, Cocos (Keeling) Islands','Willemstad','Windhoek','Yamoussoukro','Yaoundé','Yaren district','Yerevan','Zagreb'];

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
				arrivalTime: departureTime.add('minutes', getRnd(150, 480)).toDate()
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

FlightSchema.statics.generate = function (count) {
	var self = this;

	Carrier.find({}, function (err, carriers) {
		if (!err) {
			var pathLen = getRnd(1, 5);

			for (var i = 0; i < count; i++) {
				var flight = new self({
					capacity: getRnd(10, 200),
					note: 'Poznamka ze dne ' + moment().toString(),
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

module.exports = mongoose.model('Flight', FlightSchema);
