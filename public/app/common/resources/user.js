define([
	'angular',
	'common/resources/resource'
], function (angular) {
	'use strict';
	
	angular.module('resources.user', ['resources.resource'])
		.factory('User', ['resource', '$http', function (resource, $http) {
			var User = resource('users');
			
			User.checkLogin = function (login) {
				return $http.get(this.getResourceUrl() + '/checkLogin', {
					params: {
						login: login
					}
				}).then(function (response) {
					return response.data;
				});
			};

			return User;
		}]);
});