define(['angular'], function (angular) {
	'use strict';

	angular.module('security.authorization', ['security.service'])
		.provider('securityAuthorization', {
			requireAdminUser: ['securityAuthorization', function (securityAuthorization) {
				return securityAuthorization.requireAdminUser();
			}],

			requireAuthenticatedUser: ['securityAuthorization', function (securityAuthorization) {
				return securityAuthorization.requireAuthenticatedUser();
			}],

			$get: ['security', 'securityRetryQueue', function (security, queue) {
				var service = {
					requireAuthenticatedUser: function () {
						var promise = security.requestCurrentUser().then(function (userInfo) {
							if (!security.isAuthenticated()) {
								return queue.pushRetryFn('unauthenticated-client', service.requireAuthenticatedUser);
							}
						});

						return promise;
					},

					requireAdminUser: function () {
						var promise = security.requestCurrentUser().then(function (userInfo) {
							if (!security.isAdmin()) {
								return queue.pushRetryFn('unauthorized-client', service.requireAdminUser);
							}
						});

						return promise;
					}
				};

				return service;
			}]
		});
});
