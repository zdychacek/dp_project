define([
	'angular',
	'_common/resources/resource'
], function (angular) {
	'use strict';

	angular.module('resources.flight', ['resources.resource'])
		.factory('Flight', ['resource', '$http', function (resource, $http) {
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

			Flight.prototype.makeReservation = function () {
				var url = this.getResourceUrl() + '/' + this.$id() + '/make-reservation';

				return $http.get(url).then(function (response) {
					return Flight._parseResponse(response);
				});
			};

			Flight.prototype.cancelReservation = function () {
				var url = this.getResourceUrl() + '/' + this.$id() + '/cancel-reservation';

				return $http.get(url).then(function (response) {
					return Flight._parseResponse(response);
				});
			};

			return Flight;
		}]);
});
