const destinations = ['Abu Dhabi','Abuja','Accra','Adamstown, Pitcairn Island','Addis Ababa','Algiers','Alofi','Amman','Amsterdam','Andorra la Vella','Ankara','Antananarivo','Apia','Ashgabat','Asmara','Astana','Asunción','Athens','Avarua','Baghdad','Baku','Bamako','Bandar Seri Begawan','Bangkok','Bangui','Banjul','Basseterre','Beijing','Beirut','Belgrade','Belmopan','Berlin','Bern','Bishkek','Bissau','Bogotá','Brasília','Bratislava','Brazzaville','Bridgetown','City of Brussels','Bucharest','Budapest','Buenos Aires','Bujumbura','Cairo','Canberra','Caracas','Castries','Cayenne','Charlotte Amalie, United States Virgin Islands','Chisinau','Cockburn Town','Conakry','Copenhagen','Dakar','Damascus','Dhaka','Dili','Djibouti (city)','Dodoma','Doha','Douglas, Isle of Man','Dublin','Dushanbe','Edinburgh of the Seven Seas','El Aaiún','Episkopi Cantonment','Flying Fish Cove','Freetown','Funafuti','Gaborone','George Town, Cayman Islands','Georgetown, Ascension Island','Georgetown, Guyana','Gibraltar','Grytviken','Guatemala City','Gustavia, Saint Barthélemy','Hagåtña','Hamilton, Bermuda','Hanga Roa','Hanoi','Harare','Hargeisa','Havana','Helsinki','Honiara','Islamabad','Jakarta','Jamestown, Saint Helena','Jerusalem','Jerusalem','Juba','Kabul','Kampala','Kathmandu','Khartoum','Kiev','Kigali','Kingston, Jamaica','Kingston, Norfolk Island','Kingstown, Saint Vincent and the Grenadines','Kinshasa','Kuala Lumpur','Kuwait City','Libreville','Lilongwe','Lima','Lisbon','Ljubljana','Lomé','London','Luanda','Lusaka','Luxembourg (city)','Madrid','Majuro','Malabo','Malé','Managua','Manama','Manila','Maputo','Marigot, Saint Martin','Maseru','Mata-Utu','Mbabane','Melekeok','Mexico City','Minsk','Mogadishu','Monaco','Monrovia','Montevideo','Moroni, Comoros','Moscow','Muscat, Oman','Nairobi','Nassau, Bahamas','Naypyidaw','N\'Djamena','New Delhi','Niamey','Nicosia','Nicosia','Nouakchott','Nouméa','Nukuʻalofa','Nuuk','Oranjestad, Aruba','Oslo','Ottawa','Ouagadougou','Pago Pago','Palikir','Panama City','Papeete','Paramaribo','Paris','Philipsburg, Sint Maarten','Phnom Penh','Plymouth, Montserrat','Podgorica','Port Louis','Port Moresby','Port Vila','Port-au-Prince','Port of Spain','Porto-Novo','Prague','Praia','Pretoria','Pristina','Pyongyang','Quito','Rabat','Reykjavík','Riga','Riyadh','Road Town','Rome','Roseau','Saipan','San José, Costa Rica','San Juan, Puerto Rico','City of San Marino','San Salvador','Sana\'a','Santiago','Santo Domingo','São Tomé','Sarajevo','Seoul','Singapore','Skopje','Sofia','Sri Jayawardenepura Kotte','St. George\'s, Grenada','St. Helier','St. John\'s, Antigua and Barbuda','St. Peter Port','St. Pierre, Saint-Pierre and Miquelon','Stanley, Falkland Islands','Stepanakert','Stockholm','Sucre','Sukhumi','Suva','Taipei','Tallinn','Tarawa','Tashkent','Tbilisi','Tegucigalpa','Tehran','Thimphu','Tirana','Tiraspol','Tokyo','Tórshavn','Tripoli','Tskhinvali','Tunis','Ulan Bator','Vaduz','Valletta','The Valley, Anguilla','Vatican City','Victoria, Seychelles','Vienna','Vientiane','Vilnius','Warsaw','Washington, D.C.','Wellington','West Island, Cocos (Keeling) Islands','Willemstad','Windhoek','Yamoussoukro','Yaoundé','Yaren district','Yerevan','Zagreb'];
const MIN_QUERY_LEN = 2;

var Q = require('q');

var Destination = {

	getAll: function () {
		return destinations;
	},
	
	filter: function (query) {
		var regExp = new RegExp(query, 'i'),
			deferred = Q.defer();

		if (!query || query.length < MIN_QUERY_LEN) {
			deferred.resolve([]);
		}
		else {
			var filtered = destinations.filter(function (dest) {
				if (dest.match(regExp)) {
					return dest;
				}
			});

			deferred.resolve(filtered);
		}

		return deferred.promise;
	}
};

module.exports = Destination;
