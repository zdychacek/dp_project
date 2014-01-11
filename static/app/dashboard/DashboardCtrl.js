define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('dashboard', [])
		.config(['$routeProvider', function ($routeProvider) {
			$routeProvider.when('/dashboard', {
				title: 'dashboard',
				templateUrl: '/static/app/dashboard/dashboard.html',
				controller: 'DashboardCtrl',
			});
		}])

		.controller('DashboardCtrl', ['$scope', function ($scope) {
			$scope.version = 0.1;
		}]);
});