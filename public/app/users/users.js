define([
	'angular',
	'lodash',
	'common/resources/users'
], function (angular, _) {
	'use strict';

	angular.module('users', [
		'security.authorization',
		'services.i18nNotifications',
		'resources.users',
		'ui.bootstrap.modal'
	])
		.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
			$routeProvider.when('/spravovane-ucty', {
				title: 'Sklik - spravované účty',
				templateUrl: '/static/app/users/usersList.html',
				controller: 'UsersCtrl',
				resolve: {
					adminUser: securityAuthorizationProvider.requireAdminUser
				}
			});
		}])

		.constant('ACCESS_LIST', [
			{ name: 'Jen pro čtení', value: 'r' },
			{ name: 'Čtení a zápis', value: 'rw' }
		])

		// Seznam uctu
		.controller('UsersCtrl', ['$scope', 'Users', '$modal', function ($scope, Users, $modal) {
			var editDialog = null,
				requestAccessDialog = null;

			$scope.users = [];
			$scope.limitsList = [2, 5, 10, 20, 30];

			// paging
			$scope.itemsPerPage = $scope.limitsList[1],
			$scope.totalItems = 0;
			$scope.currentPage = 1;

			// sorting
			$scope.sort = {
				column: 'relationName',
				dir: 'asc'
			};

			var loadUsers = function () {
				$scope.users = Users.query({
					offset: ($scope.currentPage - 1) * $scope.itemsPerPage,
					limit: $scope.itemsPerPage,
					sort: $scope.sort.column,
					dir: $scope.sort.dir
				}, function (users, responseHeadersGetter) {
					var headers = responseHeadersGetter();

					$scope.totalItems = headers['total-count'];
				});
			};

			$scope.editUser = function (user) {
				editDialog = $modal.open({
					templateUrl: 'static/app/users/editUserDialog.html',
					controller: 'EditUserDialogCtrl',
					resolve: {
						editedUser: function () {
							return angular.copy(user);
						}
				    }
				});

				editDialog.result.then(function () {
					loadUsers();
				});
			};

			$scope.requestAccess = function () {
				requestAccessDialog = $modal.open({
					templateUrl: 'static/app/users/requestAccessDialog.html',
					controller: 'RequestAccessDialogCtrl'
				});

				requestAccessDialog.result.then(function () {
					console.log('Okno zavreno...');
				});
			};

			$scope.selectPage = function (pageNum) {
				$scope.currentPage = pageNum;
			};

			$scope.$watch('itemsPerPage', loadUsers);
			$scope.$watch('currentPage', loadUsers);
			$scope.$watch('sort', loadUsers, true);
		}])

		// Modalni okno pro editaci uctu
		.controller('EditUserDialogCtrl', [
			'$scope',
			'$modalInstance',
			'editedUser',
			'i18nNotifications',
			'ACCESS_LIST',
		function ($scope, $modalInstance, editedUser, i18nNotifications, ACCESS_LIST) {
			$scope.user = editedUser;

			console.log($scope.user);

			var showNotification = function (success) {
				i18nNotifications.removeAll();
				i18nNotifications.pushForCurrentRoute(success ? 'save.success' : 'save.error', success ? 'success' : 'error');
			};

			$scope.accessList = ACCESS_LIST;

			$scope.closeModal = function (result) {
				$modalInstance.close(result);
			};

			$scope.disconnectAccount = function () {
				$scope.user.$disconnectAccount(function (savedUser) {
					$scope.closeModal();
					showNotification(false);
				});
			};

			$scope.saveChanges = function () {
				$scope.user.$save(function (savedUser) {
					$scope.closeModal($scope.user);
					showNotification(true);
				});
			};
		}])

		// Modalni okno pro zadost o vytvoreni propojeni
		.controller('RequestAccessDialogCtrl', [
			'$scope',
			'$modalInstance',
			'i18nNotifications',
			'ACCESS_LIST',
		function ($scope, $modalInstance, i18nNotifications, ACCESS_LIST) {
			$scope.request = {
				name: '',
				access: ACCESS_LIST[0].value
			};

			var showNotification = function (success) {
				i18nNotifications.removeAll();
				i18nNotifications.pushForCurrentRoute(success ? 'save.success' : 'save.error', success ? 'success' : 'error');
			};

			$scope.accessList = ACCESS_LIST;

			$scope.closeModal = function (result) {
				$modalInstance.close(result);
			};

			$scope.requestAccess = function () {
				$scope.closeModal();

				console.log('POST:', $scope.request);
			};
		}]);
});