define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('account', [])
		.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
			$routeProvider.when('/account', {
				title: 'účet',
				templateUrl: '/static/app/account/account.html',
				controller: 'AccountCtrl',
				resolve: {
					authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
				}
			});
		}])

		.controller('AccountCtrl', ['$scope', function ($scope) {

		}]);
});