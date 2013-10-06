define(['angular'], function (angular) {
	'use strict';

	angular.module('base.MainCtrl', [])
		.controller('MainCtrl', ['$scope', '$rootScope', 'i18nNotifications', 'localizedMessages', function ($scope, $rootScope, i18nNotifications) {
			$scope.notifications = i18nNotifications;

			$scope.removeNotification = function (notification) {
				i18nNotifications.remove(notification);
			};

			$scope.$on('$routeChangeError', function(event, current, previous, rejection){
				i18nNotifications.pushForCurrentRoute('errors.route.changeError', 'error', {}, { rejection: rejection });
			});

			$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
				// nastaveni titulku stranky
				$rootScope.title = current.$$route.title;
			});
		}]);
});