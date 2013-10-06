define([
	'angular',
	'lodash'
], function (angular, _) {
	'use strict';

	angular.module('base', [])
		.controller('AppCtrl', ['$scope', 'i18nNotifications', 'localizedMessages', function ($scope, i18nNotifications) {
			$scope.notifications = i18nNotifications;

			$scope.removeNotification = function (notification) {
				i18nNotifications.remove(notification);
			};

			$scope.$on('$routeChangeError', function(event, current, previous, rejection){
				i18nNotifications.pushForCurrentRoute('errors.route.changeError', 'error', {}, { rejection: rejection });
			});
		}])

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