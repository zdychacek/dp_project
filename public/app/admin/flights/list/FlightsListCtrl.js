define([
	'angular',
	'common/resources/flight'
], function (angular) {
	'use strict';

	angular.module('admin.flights.list', [
		'security.authorization',
		'services.i18nNotifications',
		'resources.flight'
	])
		.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
			$routeProvider.when('/admin/flights', {
				title: 'editace letů',
				templateUrl: '/static/app/admin/flights/list/flightsList.html',
				controller: 'FlightsListCtrl',
				resolve: {
					adminUser: securityAuthorizationProvider.requireAdminUser
				}
			});
		}])

		// Seznam uctu
		.controller('FlightsListCtrl', ['$scope', 'Flight', '$location', function ($scope, Flight, $location) {
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

			var loadFlights = function () {
				$scope.loadingData = true;

				$scope.flights = Flight.query({
					offset: ($scope.currentPage - 1) * $scope.itemsPerPage,
					limit: $scope.itemsPerPage,
					sort: $scope.sort.column,
					dir: $scope.sort.dir
				}, function (flights, responseHeadersGetter) {
					var headers = responseHeadersGetter();

					$scope.loadingData = false;
					$scope.totalItems = headers['total-count'];
				});
			};

			$scope.editFlight = function (flight) {
				$location.path('/admin/flights/' + flight._id);
			};

			$scope.removeFlight = function (flight) {
				Flight.delete({ id: flight._id }, function () {
					loadFlights();
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

			$scope.$watch('itemsPerPage', loadFlights);
			$scope.$watch('currentPage', loadFlights);
			$scope.$watch('sort', loadFlights, true);
		}]);
});