define([
	'angular',
	'angular-resource'
], function (angular) {
	'use strict';
	
	angular.module('resources.user', ['ngResource'])
		.factory('User', ['$resource', function ($resource) {
			var User = $resource('/api/v1/users/:id', {
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
			
			return User;
		}]);
});