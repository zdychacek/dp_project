define([
	'angular',
	'_common/resources/resource'
], function (angular) {
	'use strict';

	angular.module('resources.destination', ['resources.resource'])
		.factory('Destination', ['resource', function (resource) {
			var Destination = resource('destinations');

			Destination.filter = function (query) {
				return Destination.query({ q: query });
			};

			return Destination;
		}]);
});
