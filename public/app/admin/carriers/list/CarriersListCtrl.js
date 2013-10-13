define([
	'angular',
	'common/resources/carrier'
], function (angular) {
	'use strict';

	angular.module('admin.carriers.list', [
		'security.authorization',
		'services.i18nNotifications',
		'resources.carrier'
	])
		.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
			$routeProvider.when('/admin/carriers', {
				title: 'editace přepravců',
				templateUrl: '/static/app/admin/carriers/list/carriersList.html',
				controller: 'CarriersListCtrl',
				resolve: {
					adminUser: securityAuthorizationProvider.requireAdminUser
				}
			});
		}])

		// Seznam uctu
		.controller('CarriersListCtrl', ['$scope', 'Carrier', '$location', function ($scope, Carrier, $location) {
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

			var loadCarriers = function () {
				$scope.loadingData = true;

				$scope.carriers = Carrier.query({
					offset: ($scope.currentPage - 1) * $scope.itemsPerPage,
					limit: $scope.itemsPerPage,
					sort: $scope.sort.column,
					dir: $scope.sort.dir
				}, function (carriers, responseHeadersGetter) {
					var headers = responseHeadersGetter();

					$scope.loadingData = false;
					$scope.totalItems = headers['total-count'];
				});
			};

			$scope.editCarrier = function (carrier) {
				$location.path('/admin/carriers/' + carrier._id);
			};

			$scope.removeCarrier = function (carrier) {
				Carrier.delete({ id: carrier._id }, function () {
					loadCarriers();
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

			$scope.$watch('itemsPerPage', loadCarriers);
			$scope.$watch('currentPage', loadCarriers);
			$scope.$watch('sort', loadCarriers, true);
		}]);
});