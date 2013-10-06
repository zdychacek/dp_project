define(['angular'], function (angular) {
	'use strict';
	
	angular.module('resources.user', [])
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