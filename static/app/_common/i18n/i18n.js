define([
	'angular',
	'_common/i18n/messages'
], function (angular) {
	'use strict';

	angular.module('i18n', ['i18n.messages'])
		.factory('i18n', ['$interpolate', 'I18N_MESSAGES', function ($interpolate, I18N_MESSAGES) {
			var handleNotFound = function (msg, msgKey) {
				return msg || '**' + msgKey + '**';
			};

			return {
				get: function (msgKey, interpolateParams) {
					var msg =  I18N_MESSAGES[msgKey];

					if (msg) {
						return $interpolate(msg)(interpolateParams);
					}
					else {
						return handleNotFound(msg, msgKey);
					}
				}
			};
		}]);
});
