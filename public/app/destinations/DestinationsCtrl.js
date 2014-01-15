define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('destinations', [])
		.config(['$routeProvider', function ($routeProvider) {
			$routeProvider.when('/destinations', {
				title: 'dashboard',
				templateUrl: '/static/app/destinations/destinations.html',
				controller: 'DestinationsCtrl',
			});
		}])

		.controller('DestinationsCtrl', ['$scope', function ($scope) {
			$scope.test = 'Terezka';
		}]);
});
