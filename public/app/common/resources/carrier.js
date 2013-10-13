define([
	'angular',
	'angular-resource'
], function (angular) {
	'use strict';
	
	angular.module('resources.carrier', ['ngResource'])
		.factory('Carrier', ['$resource', function ($resource) {
			var Carrier = $resource('/api/v1/carriers/:id', {
				id: '@id'
			}, {
				query:  {
					method: 'GET',
					params: {
						limit: 0,
						offset: 0,
						sort: '',
						dir: ''
					},
					isArray:true
				},
				update: { method: 'PUT' }
			});
			
			return Carrier;
		}]);
});