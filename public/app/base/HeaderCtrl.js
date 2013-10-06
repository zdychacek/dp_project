define(['angular'], function (angular) {
	'use strict';

	angular.module('base.HeaderCtrl', [])
		.controller('HeaderCtrl', ['$scope', '$location', '$route', 'security', 'breadcrumbs', 'notifications', 'httpRequestTracker',
			function ($scope, $location, $route, security, breadcrumbs, notifications, httpRequestTracker) {
				$scope.location = $location;
				$scope.breadcrumbs = breadcrumbs;

				$scope.isAuthenticated = security.isAuthenticated;
				$scope.isAdmin = security.isAdmin;

				$scope.home = function () {
					if (security.isAuthenticated()) {
						$location.path('/seznam-kampani');
					}
					else {
						$location.path('/welcome');
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