define([
	'angular',
	'common/resources/flight',
	'common/resources/carrier',
	'common/services/notifications',
	'common/security/authorization'
], function (angular) {
	'use strict';

	angular.module('admin.flights.edit', [
		'security.authorization',
		'services.notifications',
		'resources.flight',
		'resources.carrier'
	])
		.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
			$routeProvider.when('/admin/flights/:id', {
				title: 'editace přepravce',
				templateUrl: '/static/app/admin/flights/edit/flightEdit.html',
				controller: 'FlightEditCtrl',
				resolve: {
					adminUser: securityAuthorizationProvider.requireAdminUser,
					carriers: ['Carrier', function (Carrier) {
						return Carrier.query();
					}]
				}
			});
		}])

		.controller('FlightEditCtrl', [
			'$scope',
			'Flight',
			'$routeParams',
			'notifications',
			'$location',
			'carriers',
		function ($scope, Flight, $routeParams, notifications, $location, carriers) {
			$scope.carriersList = carriers.items;
			console.log($scope.carriersList);
			$scope.creatingNew = $routeParams.id == 'new';
			
			// defaultni hodnoty
			$scope.flight = {
				price: 0,
				capacity: 10,
				path: []
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
						$location.path('/admin/carriers/' + flight._id);
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
				$scope.flight.path.push({
					carrier: $scope.carriersList[0]
				});
			};

			$scope.makeLogoUrl = function (carrier) {
				if (carrier) {
					return '/static/img/carriersLogos/' + carrier.logo;
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

			// init
			// pridam jednu polozku
			$scope.addPathPart();
		}]);
});