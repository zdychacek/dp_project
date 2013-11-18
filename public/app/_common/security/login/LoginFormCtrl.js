define(['angular'], function (angular) {
	'use strict';

	angular.module('security.login.form', ['services.localizedMessages'])
		.controller('LoginFormCtrl', ['$scope', 'security', 'localizedMessages', function ($scope, security, localizedMessages) {
			$scope.user = {
				login: '12345',
				password: '12345'
			};

			$scope.authError = null;
			$scope.authReason = null;

			if (security.getLoginReason()) {
				$scope.authReason = security.isAuthenticated() ? localizedMessages.get('login.reason.notAuthorized') : localizedMessages.get('login.reason.notAuthenticated');
			}

			$scope.login = function () {
				$scope.authError = null;

				security.login($scope.user.login, $scope.user.password)
					.then(function (loggedIn) {
						if (!loggedIn) {
							$scope.authError = localizedMessages.get('login.error.invalidCredentials');
						}
					}, function (x) {
						$scope.authError = localizedMessages.get('login.error.serverError', { exception: x });
					});
			};

			$scope.clearForm = function() {
				$scope.user = {};
			};

			$scope.cancelLogin = function() {
				security.cancelLogin();
			};
		}]);
});
