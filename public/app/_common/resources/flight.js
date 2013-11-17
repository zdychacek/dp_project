define([
	'angular',
	'_common/resources/resource'
], function (angular) {
	'use strict';

	angular.module('resources.flight', ['resources.resource'])
		.factory('Flight', ['resource', function (resource) {
			var Flight = resource('flights', {
				fromServerConverter: function (flight) {
					if (flight.path) {
						flight.path.forEach(function (path) {
							path.departureTime = new Date(path.departureTime);
							path.arrivalTime = new Date(path.arrivalTime);
						});
					}

					return flight;
				}
			});

			return Flight;
		}]);
});
