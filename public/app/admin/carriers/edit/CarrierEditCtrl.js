define([
	'angular',
	'common/resources/carrier',
	'common/services/notifications',
	'common/security/authorization'
], function (angular) {
	'use strict';

	angular.module('admin.carriers.edit', [
		'security.authorization',
		'services.notifications',
		'resources.carrier'
	])
		.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
			$routeProvider.when('/admin/carriers/:id', {
				title: 'editace přepravce',
				templateUrl: '/static/app/admin/carriers/edit/carrierEdit.html',
				controller: 'CarrierEditCtrl',
				resolve: {
					adminUser: securityAuthorizationProvider.requireAdminUser
				}
			});
		}])

		.controller('CarrierEditCtrl', ['$scope', 'Carrier', '$routeParams', 'notifications', '$location', function ($scope, Carrier, $routeParams, notifications, $location) {
			$scope.creatingNew = $routeParams.id == 'new';
		

			if (!$scope.creatingNew) {
				$scope.loadingData = true;

				$scope.flig = Flight.get({ id: $routeParams.id }, function () {
					$scope.loadingData = false;
				});
			}

			$scope.formTitle = $scope.creatingNew ? 'Nový přepravce' : 'Editace';

			$scope.save = function () {
				if (this.form.$invalid) {
					return;
				}

				if ($scope.creatingNew) {
					$scope.carrier = new Flight($scope.carrier).$save(function (carrier) {
						notifications.pushForNextRoute({
							message: 'Nový let byl vytvořen.',
							type: 'success'
						});
						$location.path('/admin/carriers/' + carrier._id);
					});
				}
				else {
					$scope.carrier.$update(function (carrier) {
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