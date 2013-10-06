define([
	'angular',
	'lodash'
], function (angular, _) {
	'use strict';

	angular.module('reports', ['security.authorization'])
		.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
			$routeProvider.when('/seznam-prehledu', {
				title: 'Sklik - statistické přehledy',
				templateUrl: '/static/app/reports/reportsList.html',
				controller: 'ReportsCtrl',
				
				resolve: {
					adminUser: securityAuthorizationProvider.requireAdminUser
				}
			});
		}])

		.controller('ReportsCtrl', ['$scope', function ($scope) {
			$scope.reports = [];
		}]);
});