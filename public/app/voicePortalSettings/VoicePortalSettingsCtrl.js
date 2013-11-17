define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('voicePortalSettings', [])
		.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
			$routeProvider.when('/voice-portal-settings', {
				title: 'nastavení hlasového portálu',
				templateUrl: '/static/app/voicePortalSettings/settings.html',
				controller: 'VoicePortalSettingsCtrl',
				resolve: {
					authenticatedUser: securityAuthorizationProvider.requireAdminUser
				}
			});
		}])

		.controller('VoicePortalSettingsCtrl', ['$scope', function ($scope) {

		}]);
});
