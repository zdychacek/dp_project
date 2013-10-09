define([
	'angular',
	'common/resources/user'
], function (angular) {
	'use strict';

	angular.module('admin.users', [
		'security.authorization',
		'services.i18nNotifications',
		'resources.user'
	])
		.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
			$routeProvider.when('/admin/users', {
				title: 'admin/editace uživatelů',
				templateUrl: '/static/app/admin/users/usersList.html',
				controller: 'UsersListCtrl',
				resolve: {
					adminUser: securityAuthorizationProvider.requireAdminUser
				}
			});
		}])

		// Seznam uctu
		.controller('UsersListCtrl', ['$scope', 'User', '$location', function ($scope, User, $location) {
			$scope.users = [];
			$scope.itemsPerPageList = [5, 10, 15, 20];

			// paging
			$scope.itemsPerPage = $scope.itemsPerPageList[1],
			$scope.totalItems = 0;
			$scope.currentPage = 1;

			// sorting
			$scope.sort = {
				column: 'relationName',
				dir: 'asc'
			};

			var loadUsers = function () {
				$scope.loadingData = true;

				$scope.users = User.query({
					offset: ($scope.currentPage - 1) * $scope.itemsPerPage,
					limit: $scope.itemsPerPage,
					sort: $scope.sort.column,
					dir: $scope.sort.dir
				}, function (users, responseHeadersGetter) {
					var headers = responseHeadersGetter();

					$scope.loadingData = false;
					$scope.totalItems = headers['total-count'];
				});
			};

			$scope.editUser = function (user) {
				$location.path('/admin/users/' + user._id + '/edit');
			};

			$scope.removeUser = function (user) {
				User.delete({ id: user._id }, function () {
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