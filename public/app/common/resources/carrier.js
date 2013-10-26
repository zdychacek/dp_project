define([
	'angular',
	'common/resources/resource'
], function (angular) {
	'use strict';
	
	angular.module('resources.carrier', ['resources.resource'])
		.factory('Carrier', ['resource', function (resource) {
			var Carrier = resource('/api/v1/carriers/');
			
			return Carrier;
		}]);
});