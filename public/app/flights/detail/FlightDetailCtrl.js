define([
	'angular',
	'moment',
	'_common/resources/flight',
	'_common/resources/carrier',
	'_common/resources/destination',
	'_common/services/notifications',
	'_common/security/authorization',
	'_common/security/security'
], function (angular, moment) {
	'use strict';

	angular.module('flights.detail', [
		'security.authorization',
		'services.notifications',
		'resources.flight',
		'resources.destination',
		'resources.carrier'
	])
		.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
			$routeProvider.when('/flights/:id', {
				title: 'editace přepravce',
				templateUrl: '/static/app/flights/detail/flightDetail.html',
				controller: 'FlightDetailCtrl',
				resolve: {
					authorization: securityAuthorizationProvider.requireAuthenticatedUser,
					carriers: ['Carrier', function (Carrier) {
						return Carrier.query();
					}]
				}
			});
		}])
		.controller('FlightDetailCtrl', [
			'$scope',
			'Flight',
			'Destination',
			'$routeParams',
			'notifications',
			'$location',
			'carriers',
			'security',
		function ($scope, Flight, Destination, $routeParams, notifications, $location, carriers, security) {
			$scope.carriersList = carriers.items;
			$scope.creatingNew = $routeParams.id == 'new';
			$scope.isAdmin = security.isAdmin();

			// defaultni hodnoty
			$scope.flight = {
				price: 10,
				capacity: 100,
				note: '',
				path: []
			};

			$scope.getCities = function (value) {
				return Destination.filter(value);
			};

			if (!$scope.creatingNew) {
				$scope.loadingData = true;

				Flight.get({ _id: $routeParams.id }).then(function (flight) {
					$scope.loadingData = false;

					if (!flight) {
						$scope.noData = true;
					}
					else {
						$scope.flight = flight;
					}
				});
			}

			$scope.formTitle = $scope.creatingNew ? 'Nový let' : 'Editace letu';

			$scope.save = function () {
				if (this.form.$invalid) {
					return;
				}

				if ($scope.creatingNew) {
					Flight.save($scope.flight).then(function (flight) {
						notifications.pushForNextRoute({
							message: 'Nový let byl vytvořen.',
							type: 'success'
						});
						$location.path('/flights/' + flight._id);
					});
				}
				else {
					$scope.flight.$update().then(function (flight) {
						notifications.pushForCurrentRoute({
							message: 'Změny byly uloženy.',
							type: 'success'
						});
						$scope.flight = flight;
					});
				}
			};

			$scope.showErrorMessage = function (field, validityType) {
				return field.$error[validityType || 'required'] && field.$dirty;
			};

			$scope.addPathPart = function () {
				var pathLen = $scope.flight.path.length,
					previousPath = $scope.flight.path[pathLen - 1] || null,
					departureTime = previousPath ? moment(previousPath.arrivalTime).add(15, 'minutes').toDate() : new Date();

				$scope.flight.path.push({
					carrier: $scope.carriersList[0]._id,
					fromDestination: previousPath ? previousPath.toDestination : '',
					departureTime: departureTime,
					arrivalTime: moment(departureTime).add(2, 'hours').toDate(),
				});
			};

			$scope.makeLogoUrl = function (carrierId) {
				var carrier = $scope.carriersList.filter(function (c) {
					return c._id == carrierId;
				});

				if (carrier && carrier[0]) {
					return '/static/img/carriersLogos/' + carrier[0].logo;
				}
			};

			$scope.getCarrierNameById = function (carrierId) {
				var carrier = $scope.carriersList.filter(function (c) {
					return c._id == carrierId;
				});

				if (carrier && carrier[0]) {
					return carrier[0].name;
				}
			};

			$scope.getPathPartLength = function (pathPart) {
				if (!pathPart.departureTime || !pathPart.arrivalTime) {
					return 0;
				}

				var departure = moment(pathPart.departureTime),
					arrival = moment(pathPart.arrivalTime);

				return arrival.diff(departure, 'minutes');
			};

			$scope.getFromDestination = function () {
				if ($scope.flight.path.length) {
					return $scope.flight.path[0].fromDestination;
				}
			};

			$scope.getToDestination = function () {
				var len = $scope.flight.path.length;

				if (len > 0) {
					return $scope.flight.path[len - 1].toDestination;
				}
			};

			$scope.removePathPart = function (pathPart) {
				var idx = $scope.flight.path.indexOf(pathPart);

				if (idx > -1) {
					$scope.flight.path.splice(idx, 1);
				}
			};

			$scope.getTotalTime = function () {
				var len = $scope.flight.path.length;

				if (len) {
					var firstPartPath = $scope.flight.path[0],
						lastPartPath =  $scope.flight.path[len - 1];

					if (firstPartPath.departureTime && lastPartPath.arrivalTime) {
						return moment(lastPartPath.arrivalTime).diff(firstPartPath.departureTime, 'minutes');
					}
					else {
						return 0;
					}
				}
				else {
					return 0;
				}
			};

			$scope.deleteFlight = function () {
				$scope.flight.$remove().then(function () {
					$location.path('/flights');
				});
			};

			if ($scope.creatingNew) {
				// pridam jednu polozku
				$scope.addPathPart();
			}
		}]);
});
