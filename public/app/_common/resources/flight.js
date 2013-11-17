define([
	'angular',
	'_common/resources/resource'
], function (angular) {
	'use strict';

	angular.module('resources.flight', ['resources.resource'])
		.factory('Flight', ['resource', function (resource) {
			var Flight = resource('flights');

			return Flight;
		}]);
});