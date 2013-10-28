define([
	'angular',
	'common/resources/flight',
	'common/services/notifications',
	'common/security/authorization'
], function (angular) {
	'use strict';

	angular.module('admin.flights.edit', [
		'security.authorization',
		'services.notifications',
		'resources.flight'
	])
		.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
			$routeProvider.when('/admin/flights/:id', {
				title: 'editace přepravce',
				templateUrl: '/static/app/admin/flights/edit/flightEdit.html',
				controller: 'FlightEditCtrl',
				resolve: {
					adminUser: securityAuthorizationProvider.requireAdminUser
				}
			});
		}])

		.controller('FlightEditCtrl', [
			'$scope',
			'Flight',
			'$routeParams',
			'notifications',
			'$location',
		function ($scope, Flight, $routeParams, notifications, $location) {
			$scope.creatingNew = $routeParams.id == 'new';

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
			else {
				$scope.flight = {};
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
		}]);
});