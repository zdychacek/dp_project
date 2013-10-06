define([
	'angular',
	'lodash'
], function (angular, _) {
	'use strict';

	angular.module('imports', ['security.authorization'])
		.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
			$routeProvider.when('/nastroje/import-dat', {
				templateUrl: '/static/app/tools/imports/importsList.html',
				controller: 'ImportsCtrl',
				
				resolve: {
					adminUser: securityAuthorizationProvider.requireAdminUser
				}
			});
		}])

		.controller('ImportsCtrl', ['$scope', function ($scope) {
			$scope.imports = [];
		}]);
});