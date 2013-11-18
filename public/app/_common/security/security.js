define([
	'angular',
	'config'
], function (angular) {
	'use strict';

	// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
	angular.module('security.service', [
			'security.retryQueue',
			'security.login',
			'ui.bootstrap.modal',
			'app.config'
		])

		.factory('security', [
			'$http',
			'$q',
			'$location',
			'securityRetryQueue',
			'$modal',
			'config',
		function ($http, $q, $location, queue, $modal, config) {
			function redirect (url) {
				url = url || '/';
				$location.path(url);
			}

			var loginDialog = null;

			function openLoginDialog () {
				if (loginDialog) {
					throw new Error('Trying to open a dialog that is already open!');
				}

				loginDialog = $modal.open({
					templateUrl: '/static/app/_common/security/login/form.html',
					controller: 'LoginFormCtrl',
					backdrop: 'static',
					keyboard: false
				});

				loginDialog.result.then(onLoginDialogClose);
			}

			function closeLoginDialog (success) {
				if (loginDialog) {
					loginDialog.close(success);
				}
			}

			function onLoginDialogClose (success) {
				loginDialog = null;

				if (success) {
					if (queue.hasMore()) {
						queue.retryAll();
					}
					else {
						redirect('/flights');
					}
				}
				else {
					queue.cancelAll();
					redirect();
				}
			}

			// Register a handler for when an item is added to the retry queue
			queue.onItemAddedCallbacks.push(function (retryItem) {
				if (queue.hasMore()) {
					service.showLogin();
				}
			});

			// The public API of the service
			var service = {
				getLoginReason: function () {
					return queue.retryReason();
				},

				showLogin: function () {
					openLoginDialog();
				},

				login: function (login, password) {
					var request = $http.post(config.baseRestApiUrl + '/security/login', {
						login: login,
						password: password
					});

					return request.then(function (response) {
						var data = response.data;

						service.currentUser = data.user;

						if (service.isAuthenticated()) {
							closeLoginDialog(true);
						}

						return {
							loggedIn: !!service.currentUser,
							errors: data._errors_ || null
						};
					});
				},

				cancelLogin: function () {
					closeLoginDialog(false);
					redirect();
				},

				logout: function (redirectTo) {
					$http.post(config.baseRestApiUrl + '/security/logout').then(function () {
						service.currentUser = null;
						redirect(redirectTo);
					});
				},

				requestCurrentUser: function () {
					if (service.isAuthenticated()) {
						return $q.when(service.currentUser);
					}
					else {
						return $http.get(config.baseRestApiUrl + '/security/current-user').then(function (response) {
							service.currentUser = response.data.user;

							return service.currentUser;
						});
					}
				},

				currentUser: null,

				isAuthenticated: function (){
					return !!service.currentUser;
				},

				isAdmin: function () {
					return !!(service.currentUser && service.currentUser.isAdmin);
				}
			};

			return service;
		}]);
});
