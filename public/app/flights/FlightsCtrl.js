define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('flights', [])
		.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
			$routeProvider.when('/flights', {
				title: 'seznam letů',
				templateUrl: '/static/app/flights/flights.html',
				controller: 'FlightsListCtrl',
				resolve: {
					authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
				}
			});
		}])

		.controller('FlightsListCtrl', ['$scope', function ($scope) {

		}]);
});