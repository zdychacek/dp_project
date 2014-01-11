define(['angular'], function (angular) {
	'use strict';

	angular.module('services.notifications', [])
		.factory('notifications', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
			var notifications = {
				'STICKY': [],
				'ROUTE_CURRENT': [],
				'ROUTE_NEXT': []
			};
			var notificationsService = {};

			var addNotification = function (notificationsArray, notifications, removeQueue) {
				if (!notifications) {
					return;
				}

				if (!angular.isArray(notifications)) {
					notifications = [ notifications ];
				}

				if (removeQueue) {
					notificationsArray.length = 0;
				}

				notifications.forEach(function (notification) {
					if (!angular.isObject(notification)) {
						throw new Error('Only object can be added to the notification service');
					}

					notificationsArray.push(notification);
				});

				// po určité době zprývy schováme
				$timeout(function () {
					for (var i = notificationsArray.length - 1; i >= 0; i--) {
						if (notifications.indexOf(notificationsArray[i]) > -1) {
							notificationsArray.splice(i, 1);
						}
					}
				}, 5000);

				return notifications;
			};

			$rootScope.$on('$routeChangeSuccess', function () {
				notifications.ROUTE_CURRENT.length = 0;
				notifications.ROUTE_CURRENT = angular.copy(notifications.ROUTE_NEXT);
				notifications.ROUTE_NEXT.length = 0;
			});

			notificationsService.getCurrent = function (){
				return [].concat(notifications.STICKY, notifications.ROUTE_CURRENT);
			};

			notificationsService.pushSticky = function (notification, removeQueue) {
				return addNotification(notifications.STICKY, notification, removeQueue);
			};

			notificationsService.pushForCurrentRoute = function (notification, removeQueue) {
				return addNotification(notifications.ROUTE_CURRENT, notification, removeQueue);
			};

			notificationsService.pushForNextRoute = function (notification, removeQueue) {
				return addNotification(notifications.ROUTE_NEXT, notification, removeQueue);
			};

			notificationsService.remove = function (notification) {
				angular.forEach(notifications, function (notificationsByType) {
					var idx = notificationsByType.indexOf(notification);

					if (idx>-1){
						notificationsByType.splice(idx,1);
					}
				});
			};

			notificationsService.removeAll = function(){
				angular.forEach(notifications, function (notificationsByType) {
					notificationsByType.length = 0;
				});
			};

			return notificationsService;
		}]);
});
