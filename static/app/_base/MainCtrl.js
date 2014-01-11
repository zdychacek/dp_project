define([
	'angular',
	'_common/services/i18nNotifications',
	'_common/services/socket'
], function (angular) {
	'use strict';

	angular.module('base.MainCtrl', [
		'services.i18nNotifications',
//		'services.socket'
	])
		.controller('MainCtrl', [
			'$scope',
			'$rootScope',
			'i18nNotifications',
//			'socket',
		function ($scope, $rootScope, i18nNotifications, socket) {
			$scope.notifications = i18nNotifications;

			$scope.removeNotification = function (notification) {
				i18nNotifications.remove(notification);
			};

			$scope.$on('$routeChangeError', function(event, current, previous, rejection){
				i18nNotifications.pushForCurrentRoute('errors.route.changeError', 'error', {}, { rejection: rejection });
			});

			$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
				// nastaveni titulku stranky
				if (current.$$route) {
					$rootScope.title = current.$$route.title;
				}
			});

			/*socket.on('flight:changed', function (flightData) {
				$rootScope.$broadcast('flight:changed', flightData);
			});

			socket.on('flight:deleted', function (flightId) {
				$rootScope.$broadcast('flight:deleted', flightId);
			});

			socket.on('flight:created', function (flightData) {
				$rootScope.$broadcast('flight:created', flightData);
			});*/
		}]);
});
