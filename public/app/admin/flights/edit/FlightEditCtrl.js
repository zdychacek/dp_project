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
				title: 'admin/editace uživatele',
				templateUrl: '/static/app/admin/flights/edit/flightEdit.html',
				controller: 'FlightEditCtrl',
				resolve: {
					adminUser: securityAuthorizationProvider.requireAdminUser
				}
			});
		}])

		.controller('FlightEditCtrl', ['$scope', 'Flight', '$routeParams', 'notifications', '$location', function ($scope, Flight, $routeParams, notifications, $location) {
			$scope.creatingNew = $routeParams.id == 'new';
		

			if (!$scope.creatingNew) {
				$scope.loadingData = true;

				$scope.flig = Flight.get({ id: $routeParams.id }, function () {
					$scope.loadingData = false;
				});
			}

			$scope.formTitle = $scope.creatingNew ? 'Nový let' : 'Editace';

			$scope.save = function () {
				if (this.form.$invalid) {
					return;
				}

				if ($scope.creatingNew) {
					$scope.flight = new Flight($scope.flight).$save(function (flight) {
						notifications.pushForNextRoute({
							message: 'Nový let byl vytvořen.',
							type: 'success'
						});
						$location.path('/admin/flights/' + flight._id);
					});
				}
				else {
					$scope.flight.$update(function (flight) {
						notifications.pushForCurrentRoute({
							message: 'Změny byly uloženy.',
							type: 'success'
						});
					});
				}
			};

			$scope.showErrorMessage = function (field, validityType) {
				validityType || (validityType = 'required');

				return field.$error[validityType] && field.$dirty;
			};
		}]);
});