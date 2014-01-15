define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('destinations', [
		'security.authorization'
	])
		.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
			$routeProvider.when('/destinations', {
				title: 'dashboard',
				templateUrl: '/static/app/destinations/destinations.html',
				controller: 'DestinationsCtrl',
				resolve: {
					adminUser: securityAuthorizationProvider.requireAdminUser
				}
			});
		}])

		.controller('DestinationsCtrl', ['$scope', function ($scope) {
			$scope.test = 'Terezka';
		}]);
});
