define([
	'angular',
	'moment',
	'_common/resources/flight',
	'_common/resources/carrier',
	'_common/resources/destination',
	'_common/services/notifications',
	'_common/security/security'
], function (angular, moment) {
	'use strict';

	angular.module('flights.list', [
		'security.service',
		'security.authorization',
		'services.notifications',
		'resources.flight',
		'resources.destination',
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
			'Destination',
			'$location',
			'carriers',
			'security',
			'$http',
			'notifications',
		function ($scope, Flight, Destination, $location, carriers, security, $http, notifications) {
			$scope.carriersList = carriers.items;
			$scope.isAdmin = security.isAdmin();
			$scope.isFilterOn = false;

			var filterDefaults = {
				fromDestination: '',
				toDestination: '',
				onlyDirectFlight: false,
				maxTransfersCount: 5,
				priceFrom: 0,
				priceTo: 9999
				/*departureTimeFrom: moment().toDate(),
				departureTimeTo: moment().add('days', 10).toDate(),
				arrivalTimeFrom: moment().toDate(),
				arrivalTimeTo: moment().add('days', 10).toDate()*/
			};

			$scope.$watch('_filter.departureTimeFrom.getTime()', function (value) {
				if ($scope._filter.arrivalTimeFrom < value) {
					$scope._filter.arrivalTimeFrom = new Date(value);
				}
			});

			$scope.$watch('_filter.departureTimeTo.getTime()', function (value) {
				if ($scope._filter.arrivalTimeTo < value) {
					$scope._filter.arrivalTimeTo = new Date(value);
				}
			});

			$scope.$watch('_filter.arrivalTimeFrom.getTime()', function (value) {
				if ($scope._filter.departureTimeFrom > value) {
					$scope._filter.departureTimeFrom = new Date(value);
				}
			});

			$scope.$watch('_filter.arrivalTimeTo.getTime()', function (value) {
				if ($scope._filter.departureTimeTo > value) {
					$scope._filter.departureTimeTo = new Date(value);
				}
			});

			$scope.$watch('_filter.onlyDirectFlight', function (value) {
				if (value) {
					$scope._filter.maxTransfersCount = 0;
				}
				else {
					$scope._filter.maxTransfersCount = filterDefaults.maxTransfersCount;
				}
			});

			$scope.cancelDateFilter = function (type) {
				if (type == 'departure') {
					$scope._filter.departureTimeFrom = null;
					$scope._filter.departureTimeTo = null;
				}
				else if (type == 'arrival') {
					$scope._filter.arrivalTimeFrom = null;
					$scope._filter.arrivalTimeTo = null;
				}
			};

			// vyhledavaci filtr
			$scope.filter = null;

			$scope.getCities = function (value) {
				return Destination.filter(value);
			};

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
					params.filter = $scope.filter;
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

			$scope.setReservationState = function (state, flight) {
				var methodName;

				state && (methodName = 'makeReservation');
				!state && (methodName = 'cancelReservation');

				flight[methodName]().then(function (flight) {
					notifications.removeAll();

					if (flight.hasServerErrors()) {
						notifications.pushForCurrentRoute(flight.getServerErrors());
					}
					else {
						notifications.pushForCurrentRoute({
							type: 'success',
							message: state ? 'Rezervace byla úspěšně vytvořena.' : 'Rezervace byla úspěšně zrušena.'
						});
					}

					updateFlightInCollection(flight);
				});
			};

			function getCarrierLogoUrl (carrierId) {
				var carrier = carriers.items.filter(function (c) {
					return c._id == carrierId;
				});

				if (carrier && carrier[0]) {
					return '/static/img/carriersLogos/' + carrier[0].logo;
				}
			}

			function updateFlightInCollection (flight) {
				var index = getFlightIndexInCollection(flight.$id());

				if (index > -1) {
					$scope.flights[index] = flight;
				}
			}

			function getFlightIndexInCollection (flightId) {
				var index = -1;

				$scope.flights.forEach(function (fl, i) {
					if (fl._id == flightId) {
						return (index = i);
					}
				});

				return index;
			}

			// notifikace ze socketu
			$scope.$on('flight:changed', function (e, flightData) {
				loadFlights();
			});

			$scope.$on('flight:deleted', function (e, flightId) {
				loadFlights();
			});

			$scope.$on('flight:created', function (e, flightData) {
				loadFlights();
			});

			$scope.$watch('itemsPerPage', loadFlights);
			$scope.$watch('currentPage', loadFlights);
			$scope.$watch('sort', loadFlights, true);
			$scope.$watch('filter', loadFlights);
		}]);
});
