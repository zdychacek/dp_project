define([
	'angular',
	'common/security/index',
	'common/services/breadcrumbs',
	'common/services/notifications',
	'common/services/httpRequestTracker'
], function (angular) {
	'use strict';

	angular.module('base.HeaderCtrl', [
		'security',
		'services.breadcrumbs',
		'services.notifications',
		'services.httpRequestTracker'
	])
		.controller('HeaderCtrl', [
			'$scope',
			'$location',
			'$route',
			'security',
			'breadcrumbs',
			'notifications',
			'httpRequestTracker',
		function ($scope, $location, $route, security, breadcrumbs, notifications, httpRequestTracker) {
			$scope.location = $location;
			$scope.breadcrumbs = breadcrumbs;
			$scope.isAuthenticated = security.isAuthenticated;
			$scope.isAdmin = security.isAdmin;

			$scope.home = function () {
				if (security.isAuthenticated()) {
					$location.path('/flights');
				}
				else {
					$location.path('/dashboard');
				}
			};

			$scope.isNavbarActive = function (navBarPath) {
				return navBarPath === breadcrumbs.getFirst().name;
			};

			$scope.hasPendingRequests = function () {
				return httpRequestTracker.hasPendingRequests();
			};
		}]);
});