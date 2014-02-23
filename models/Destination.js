'use strict';

var destinations = require('./destinations');
const MIN_QUERY_LEN = 2;

var Q = require('q');

var Destination = {

	getAll: function () {
		return destinations;
	},

	filter: function (query, startWith) {
		var deferred = Q.defer(),
			regExp;

		if (startWith) {
			regExp = new RegExp('^' + query, 'i');
		}
		else {
			regExp = new RegExp(query, 'i');
		}

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
