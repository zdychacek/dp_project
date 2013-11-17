define([
	'angular',
	'_common/resources/flight',
	'_common/resources/carrier',
	'_common/services/notifications',
	'_common/security/authorization'
], function (angular) {
	'use strict';

	angular.module('flights.detail', [
		'security.authorization',
		'services.notifications',
		'resources.flight',
		'resources.carrier'
	])
		.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
			$routeProvider.when('/flights/:id', {
				title: 'editace přepravce',
				templateUrl: '/static/app/flights/detail/flightDetail.html',
				controller: 'FlightDetailCtrl',
				resolve: {
					//adminUser: securityAuthorizationProvider.requireAdminUser,
					carriers: ['Carrier', function (Carrier) {
						return Carrier.query();
					}]
				}
			});
		}])

		.controller('FlightDetailCtrl', [
			'$scope',
			'Flight',
			'$routeParams',
			'notifications',
			'$location',
			'carriers',
		function ($scope, Flight, $routeParams, notifications, $location, carriers) {
			$scope.carriersList = carriers.items;
			$scope.creatingNew = $routeParams.id == 'new';

			// defaultni hodnoty
			$scope.flight = {
				price: 10,
				capacity: 100,
				path: [],
				date: new Date()
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
						$location.path('/admin/flights/' + flight._id);
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
				var pathLen = $scope.flight.path.length;

				$scope.flight.path.push({
					carrier: $scope.carriersList[0]._id,
					fromDestination: pathLen ? $scope.flight.path[pathLen - 1].toDestination : ''
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

			function parseTimeData (data) {
				if (!data) {
					return '';
				}
				else {
					var parts = data.split(':'),
						date = new Date();

					date.setHours(parts[0]);
					date.setMinutes(parts[1] || 0);

					if (parts[2] && parts[2] == 'PM') {
						date.setHours(date.getHours() + 12);
					}

					return date;
				}
			}

			$scope.getPathPartLength = function (pathPart) {
				var departure = parseTimeData(pathPart.departureTime),
					arrival = parseTimeData(pathPart.arrivalTime);

				if (departure && arrival) {
					var delta = (arrival - departure) / 1000,
						hours = Math.floor(delta / 3600) % 24,
						minutes = Math.floor(delta / 60) % 60;

					return hours + 'h ' + minutes + 'min';
				}
				else {
					return '';
				}
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

			// pridam jednu polozku
			$scope.addPathPart();
		}]);
});
