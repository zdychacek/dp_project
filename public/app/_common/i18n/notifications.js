define([
	'angular',
	'_common/services/notifications',
	'_common/i18n/i18n'
], function (angular) {
	'use strict';

	angular.module('i18n.notifications', [
		'services.notifications',
		'i18n'
	])
		.factory('i18nNotifications', ['i18n', 'notifications', function (i18n, notifications) {
			var prepareNotification = function (msgKey, type, interpolateParams, otherProperties) {
				return angular.extend({
					message: i18n.get(msgKey, interpolateParams),
					type: type
				}, otherProperties);
			};

			return {
				pushSticky: function (msgKey, type, interpolateParams, otherProperties) {
					return notifications.pushSticky(prepareNotification(msgKey, type, interpolateParams, otherProperties));
				},

				pushForCurrentRoute: function (msgKey, type, interpolateParams, otherProperties) {
					return notifications.pushForCurrentRoute(prepareNotification(msgKey, type, interpolateParams, otherProperties));
				},

				pushForNextRoute: function (msgKey, type, interpolateParams, otherProperties) {
					return notifications.pushForNextRoute(prepareNotification(msgKey, type, interpolateParams, otherProperties));
				},

				getCurrent: function () {
					return notifications.getCurrent();
				},

				remove: function (notification) {
					return notifications.remove(notification);
				},

				removeAll: function() {
					notifications.removeAll();
				}
			};
		}]);
});
