define(['angular'], function (angular) {
	'use strict';
	
	angular.module('resources.users', [])
		.factory('Users', ['$resource', function ($resource) {
			/*{ 'get':    {method:'GET'},
				'save':   {method:'POST'},
				'query':  {method:'GET', isArray:true},
				'remove': {method:'DELETE'},
				'delete': {method:'DELETE'} };
				{action1: {method:?, params:?, isArray:?, headers:?, ...} */

			var Users = $resource('/api/v1/users/:userId/:action', {
				userId: '@id'
			}, {
				query:  {
					method:'GET',
					params: {
						limit: 0,
						offset: 0,
						sort: '',
						dir: ''
					},
					isArray:true
				},
				disconnectAccount: {
					method: 'DELETE',
					params: {
						action: 'disconnectAccount'
					}
				}
			});
			
			return Users;
		}]);
});