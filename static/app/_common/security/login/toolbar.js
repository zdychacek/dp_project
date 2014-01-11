define([
	'angular'
], function (angular) {
	'use strict';

	angular.module('security.login.toolbar', [])
		.directive('loginToolbar', ['security', function (security) {
			var directive = {
				templateUrl: '/static/app/_common/security/login/toolbar.html',
				restrict: 'E',
				replace: true,
				scope: true,
				link: function ($scope, $element, $attrs, $controller) {
					$scope.isAuthenticated = security.isAuthenticated;
					$scope.login = security.showLogin;
					$scope.logout = security.logout;

					$scope.$watch(function () {
						return security.currentUser;
					}, function (currentUser) {
						$scope.currentUser = currentUser;
					});
				}
			};

			return directive;
		}]);
});
