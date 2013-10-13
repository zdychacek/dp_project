define([
	'angular',
	'angular-resource'
], function (angular) {
	'use strict';
	
	angular.module('resources.flight', ['ngResource'])
		.factory('Flight', ['$resource', function ($resource) {
			var Flight = $resource('/api/v1/flights/:id', {
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
			
			return Flight;
		}]);
});