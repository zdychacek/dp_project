define(['angular'], function (angular) {
	'use strict';

	angular.module('security.login.form', ['services.localizedMessages'])
		.controller('LoginFormCtrl', ['$scope', 'security', 'localizedMessages', function ($scope, security, localizedMessages) {
			$scope.user = {
				email: 'admin',
				password: '12345'
			};

			// Any error message from failing to login
			$scope.authError = null;

			// The reason that we are being asked to login - for instance because we tried to access something to which we are not authorized
			// We could do something diffent for each reason here but to keep it simple...
			$scope.authReason = null;

			if (security.getLoginReason()) {
				$scope.authReason = security.isAuthenticated() ? localizedMessages.get('login.reason.notAuthorized') : localizedMessages.get('login.reason.notAuthenticated');
			}

			$scope.login = function () {
				$scope.authError = null;

				security.login($scope.user.email, $scope.user.password)
					.then(function (loggedIn) {
						if (!loggedIn) {
							$scope.authError = localizedMessages.get('login.error.invalidCredentials');
						}
					}, function (x) {
						// If we get here then there was a problem with the login request to the server
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
