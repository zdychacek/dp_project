define([
	'angular',
	'lodash'
], function (angular, _) {
	'use strict';

	angular.module('welcome', [])
		.config(['$routeProvider', function ($routeProvider) {
			$routeProvider.when('/welcome', {
				title: 'Sklik - welcome',
				templateUrl: '/static/app/welcome/welcome.html',
				controller: 'WelcomeCtrl',
			});
		}])

		.controller('WelcomeCtrl', ['$scope', function ($scope) {
			$scope.version = 0.1;
		}]);
});