define([
	'angular',
	'_common/resources/user'
], function (angular) {
	'use strict';

	angular.module('users.list', [
		'security.authorization',
		'services.i18nNotifications',
		'resources.user'
	])
		.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
			$routeProvider.when('/users', {
				title: 'editace uživatelů',
				templateUrl: '/static/app/users/list/usersList.html',
				controller: 'UsersListCtrl',
				resolve: {
					adminUser: securityAuthorizationProvider.requireAdminUser
				}
			});
		}])

		// Seznam uctu
		.controller('UsersListCtrl', ['$scope', 'User', '$location', function ($scope, User, $location) {
			$scope.itemsPerPageList = [5, 10, 15, 20];

			// paging
			$scope.itemsPerPage = $scope.itemsPerPageList[1],
			$scope.totalItems = 0;
			$scope.currentPage = 1;

			// sorting
			$scope.sort = {
				column: 'login',
				dir: 'asc'
			};

			var loadUsers = function () {
				$scope.loadingData = true;

				User.query({
					offset: ($scope.currentPage - 1) * $scope.itemsPerPage,
					limit: $scope.itemsPerPage,
					sort: $scope.sort.column,
					dir: $scope.sort.dir
				}).then(function (data) {
					$scope.users = data.items;
					$scope.loadingData = false;
					$scope.totalItems = data.metadata.totalCount;
				});
			};

			$scope.editUser = function (user) {
				$location.path('/users/' + user._id);
			};

			$scope.removeUser = function (user) {
				User.remove({ _id: user._id }).then(function () {
					loadUsers();
				});
			};

			$scope.selectPage = function (pageNum) {
				$scope.currentPage = pageNum;
			};

			$scope.getTableVisibilityStyle = function () {
				if ($scope.loadingData) {
					return {
						visibility: 'hidden'
					};
				}
			};

			$scope.$watch('itemsPerPage', loadUsers);
			$scope.$watch('currentPage', loadUsers);
			$scope.$watch('sort', loadUsers, true);
		}]);
});
