define([
	'angular',
	'lodash'
], function (angular, _) {
	'use strict';

	angular.module('campaigns', ['security.authorization'])
		.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
			$routeProvider.when('/seznam-kampani', {
				title: 'Sklik - seznam kampaní',
				templateUrl: '/static/app/campaigns/campaignsList.html',
				controller: 'CampaignsCtrl',
				
				resolve: {
					adminUser: securityAuthorizationProvider.requireAdminUser
				}
			});
		}])

		.controller('CampaignsCtrl', ['$scope', function ($scope) {
			$scope.campaigns = [];
		}]);
});