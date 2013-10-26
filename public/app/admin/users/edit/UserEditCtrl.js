define([
	'angular',
	'common/resources/user',
	'common/services/notifications',
	'common/security/authorization'
], function (angular) {
	'use strict';

	angular.module('admin.users.edit', [
		'security.authorization',
		'services.notifications',
		'resources.user'
	])
		.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
			$routeProvider.when('/admin/users/:id', {
				title: 'admin/editace uživatele',
				templateUrl: '/static/app/admin/users/edit/userEdit.html',
				controller: 'UserEditCtrl',
				resolve: {
					adminUser: securityAuthorizationProvider.requireAdminUser
				}
			});
		}])

		.controller('UserEditCtrl', ['$scope', 'User', '$routeParams', 'notifications', '$location', function ($scope, User, $routeParams, notifications, $location) {
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

				User.get({ id: $routeParams.id }).then(function (user) {
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
						$location.path('/admin/users/' + user._id);
					});
				}
				else {
					$scope.user.$update().then(function (user) {
						notifications.pushForCurrentRoute({
							message: 'Změny byly uloženy.',
							type: 'success'
						});
					});
				}
			};

			$scope.showErrorMessage = function (field, validityType) {
				validityType || (validityType = 'required');

				return field.$error[validityType] && field.$dirty;
			};
		}]);
});