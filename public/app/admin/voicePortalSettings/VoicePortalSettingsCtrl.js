define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('admin.voicePortalSettings', [])
		.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
			$routeProvider.when('/admin/voice-portal-settings', {
				title: 'nastavení hlasového portálu',
				templateUrl: '/static/app/admin/voicePortalSettings/settings.html',
				controller: 'VoicePortalSettingsCtrl',
				resolve: {
					authenticatedUser: securityAuthorizationProvider.requireAdminUser
				}
			});
		}])

		.controller('VoicePortalSettingsCtrl', ['$scope', function ($scope) {

		}]);
});