define([
	'angular',
	'moment',
	'_common/resources/flight',
	'_common/resources/carrier',
	'_common/security/security'
], function (angular, moment) {
	'use strict';

	angular.module('flights.list', [
		'security.service',
		'security.authorization',
		'services.i18nNotifications',
		'resources.flight',
		'resources.carrier'
	])
		.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
			$routeProvider.when('/flights', {
				title: 'editace letů',
				templateUrl: '/static/app/flights/list/flightsList.html',
				controller: 'FlightsListCtrl',
				resolve: {
					authorization: securityAuthorizationProvider.requireAuthenticatedUser,
					carriers: ['Carrier', function (Carrier) {
						return Carrier.query();
					}]
				}
			});
		}])
		.controller('FlightsListCtrl', [
			'$scope',
			'Flight',
			'$location',
			'carriers',
			'security',
		function ($scope, Flight, $location, carriers, security) {
			$scope.carriersList = carriers.items;
			$scope.isAdmin = security.isAdmin();

			var filterDefaults = {
				fromDestination: '',
				toDestination: '',
				departureTime: moment().format('YYYY-MM-DD'),
				arrivalTime: moment().add('days', 1).format('YYYY-MM-DD')
			};

			// vyhledavaci filtr
			$scope.filter = null;

			$scope.doFilter = function () {
				$scope.filter = angular.copy($scope._filter);
			};

			$scope.resetFilter = function () {
				$scope._filter = angular.copy(filterDefaults);
				$scope.filter = null;
			};

			$scope.resetFilter();

			$scope.itemsPerPageList = [5, 10, 15, 20];

			// paging
			$scope.itemsPerPage = $scope.itemsPerPageList[1],
			$scope.totalItems = 0;
			$scope.currentPage = 1;

			// sorting
			$scope.sort = {
				column: '_id',
				dir: 'asc'
			};

			var loadFlights = function () {
				$scope.loadingData = true;

				var params = {
					offset: ($scope.currentPage - 1) * $scope.itemsPerPage,
					limit: $scope.itemsPerPage,
					sort: $scope.sort.column,
					dir: $scope.sort.dir
				};

				if ($scope.filter) {
					params.filter = $scope.filter
				}

				Flight.query(params).then(function (data) {
					$scope.flights = data.items;
					$scope.loadingData = false;
					$scope.totalItems = data.metadata.totalCount;
				});
			};

			$scope.editFlight = function (flight) {
				$location.path('/flights/' + flight._id);
			};

			$scope.removeFlight = function (flight) {
				Flight.remove({ _id: flight._id }).then(function () {
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

			$scope.isFreeCapacity = function (flight) {
				var passengersCount = flight.passengers ? flight.passengers.length : 0;

				return flight.capacity > passengersCount;
			};

			$scope.getArrivalCarrierLogo = function (flight) {
				return getCarrierLogoUrl(flight.path[0].carrier);
			};

			$scope.getDepartureCarrierLogo = function (flight) {
				var lastPathPart = flight.path[flight.path.length - 1];

				return getCarrierLogoUrl(lastPathPart.carrier);
			};

			function getCarrierLogoUrl (carrierId) {
				var carrier = carriers.items.filter(function (c) {
					return c._id == carrierId;
				});

				if (carrier && carrier[0]) {
					return '/static/img/carriersLogos/' + carrier[0].logo;
				}
			}

			$scope.$watch('itemsPerPage', loadFlights);
			$scope.$watch('currentPage', loadFlights);
			$scope.$watch('sort', loadFlights, true);
			$scope.$watch('filter', loadFlights);
		}]);
});
