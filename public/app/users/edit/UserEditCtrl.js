define([
	'angular',
	'_common/resources/user',
	'_common/services/notifications',
	'_common/security/authorization'
], function (angular) {
	'use strict';

	angular.module('users.edit', [
		'security.authorization',
		'services.notifications',
		'resources.user'
	])
		.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
			$routeProvider.when('/users/:id', {
				title: 'editace uživatele',
				templateUrl: '/static/app/users/edit/userEdit.html',
				controller: 'UserEditCtrl',
				resolve: {
					adminUser: securityAuthorizationProvider.requireAdminUser
				}
			});
		}])

		.controller('UserEditCtrl', [
			'$scope',
			'User',
			'$routeParams',
			'notifications',
			'$location',
		function ($scope, User, $routeParams, notifications, $location) {
			var originalUserLogin;

			$scope.creatingNew = $routeParams.id == 'new';

			$scope.afterLoginValidation = function (serverResult, callback) {
				if (!$scope.creatingNew && $scope.user && $scope.user.login === originalUserLogin) {
					callback(true);
				}
				else {
					callback(serverResult);
				}
			};

			if (!$scope.creatingNew) {
				$scope.loadingData = true;

				User.get({ _id: $routeParams.id }).then(function (user) {
					$scope.loadingData = false;

					if (!user) {
						$scope.noData = true;
					}
					else {
						$scope.user = user;
						originalUserLogin = $scope.user.login;
					}
				});
			}

			$scope.formTitle = $scope.creatingNew ? 'Nový uživatel' : 'Editace uživatele';

			$scope.save = function () {
				if (this.form.$invalid) {
					return;
				}

				if ($scope.creatingNew) {
					User.save($scope.user).then(function (user) {
						notifications.pushForNextRoute({
							message: 'Nový uživatel byl vytvořen.',
							type: 'success'
						});
						$location.path('/users/' + user._id);
					});
				}
				else {
					$scope.user.$update().then(function (user) {
						notifications.removeAll();

						if (user && user.getServerErrors()) {
							user._errors_.forEach(function (error) {
								notifications.pushForCurrentRoute(error);
							});
						}
						else {
							notifications.pushForCurrentRoute({
								message: 'Změny byly uloženy.',
								type: 'success'
							});
						}

						$scope.user = user;
					});
				}
			};

			$scope.showErrorMessage = function (field, validityType) {
				validityType || (validityType = 'required');

				return field.$error[validityType] && field.$dirty;
			};
		}]);
});
