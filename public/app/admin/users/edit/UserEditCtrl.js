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
			$routeProvider.when('/admin/users/:id/edit', {
				title: 'admin/editace uživatele',
				templateUrl: '/static/app/admin/users/edit/userEdit.html',
				controller: 'UserEditCtrl',
				resolve: {
					adminUser: securityAuthorizationProvider.requireAdminUser
				}
			});
		}])

		.controller('UserEditCtrl', ['$scope', 'User', '$routeParams', 'notifications', '$location', function ($scope, User, $routeParams, notifications, $location) {
			var creatingNew = +$routeParams.id == 0;

			if (!creatingNew) {
				$scope.user = User.get({ id: $routeParams.id });
			}

			$scope.formTitle = creatingNew ? 'Nový uživatel' : 'Editace';

			$scope.save = function () {
				if (this.form.$invalid) {
					return;
				}

				if (creatingNew) {
					$scope.user = new User($scope.user).$save(function (user) {
						notifications.pushForNextRoute({
							message: 'Nový uživatel byl vytvořen.',
							type: 'success'
						});
						$location.path('/admin/users/' + user._id);
					});
				}
				else {
					$scope.user.$update(function (user) {
						notifications.pushForCurrentRoute({
							message: 'Změny byly uloženy.',
							type: 'success'
						});
					});
				}
			};
		}]);
});