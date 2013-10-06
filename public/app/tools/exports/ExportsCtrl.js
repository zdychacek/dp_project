define([
	'angular',
	'lodash'
], function (angular, _) {
	'use strict';

	angular.module('exports', ['security.authorization'])
		.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
			$routeProvider.when('/nastroje/export-dat', {
				templateUrl: '/static/app/tools/exports/exportsList.html',
				controller: 'ExportsCtrl',
				
				resolve: {
					adminUser: securityAuthorizationProvider.requireAdminUser
				}
			});
		}])

		.controller('ExportsCtrl', ['$scope', function ($scope) {
			$scope.exports = [];
		}]);
});