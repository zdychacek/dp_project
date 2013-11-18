define([
	'angular',
	'moment'
], function (angular, moment) {
	'use strict';

	angular.module('security.login.form', ['services.localizedMessages'])
		.controller('LoginFormCtrl', ['$scope', 'security', 'localizedMessages', function ($scope, security, localizedMessages) {
			$scope.user = {
				login: '12345',
				password: '12345'
			};

			$scope.authErrors = null;
			$scope.authReason = null;

			if (security.getLoginReason()) {
				$scope.authReason = security.isAuthenticated() ?
					localizedMessages.get('login.reason.notAuthorized') : localizedMessages.get('login.reason.notAuthenticated');
			}

			$scope.login = function () {
				$scope.authErrors = null;

				security.login($scope.user.login, $scope.user.password)
					.then(function (loginInfo) {
						if (!loginInfo.loggedIn) {
							if (loginInfo.errors && loginInfo.errors.length) {
								$scope.authErrors = loginInfo.errors.map(function (err) {
									switch (err.type) {
										case 'banned':
											return 'Vás účet byl zablokován z důvodu nepovedených přihlášení. Účet bude opět aktivní ' + moment(err.data).format('MMM Do YYYY, HH:mm:ss');
										case 'disabled':
											return 'Váš účet je zablokován. Kontaktujte administrátora.';
										default:
											return localizedMessages.get('login.error.invalidCredentials');
									}
								});
							}
						}
					}, function (x) {
						$scope.authErrors = [ localizedMessages.get('login.error.serverError', { exception: x }) ];
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
