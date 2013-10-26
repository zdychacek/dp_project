define([
	'angular',
	'common/resources/resource'
], function (angular) {
	'use strict';
	
	angular.module('resources.flight', ['resources.resource'])
		.factory('Flight', ['resource', function (resource) {
			var Flight = resource('/api/v1/flights/');
			
			return Flight;
		}]);
});