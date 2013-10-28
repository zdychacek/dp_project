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

		.controller('CarrierEditCtrl', [
			'$scope',
			'Carrier',
			'$routeParams',
			'notifications',
			'$location',
		function ($scope, Carrier, $routeParams, notifications, $location) {
			var fileReader = new FileReader(),
				logosPath = '/static/img/carriersLogos/';

			fileReader.onloadend = function (evt) {
				$scope.$apply(function () {
					$scope.logoSrc = evt.target.result;
				});
			};

			$scope.creatingNew = $routeParams.id == 'new';

			// zdroj nahledu loga: bud base64 vytvorena pomoci FileReaderu nebo zdroj z modelu
			$scope.logoSrc = '';
		
			if (!$scope.creatingNew) {
				$scope.loadingData = true;

				Carrier.get({ _id: $routeParams.id }).then(function (carrier) {
					$scope.loadingData = false;

					if (!carrier) {
						$scope.noData = true;
					}
					else {
						$scope.carrier = carrier;
						$scope.logoSrc = logosPath + carrier.logo;
					}
				});
			}
			else {
				$scope.carrier = {};
			}

			$scope.formTitle = $scope.creatingNew ? 'Nový přepravce' : 'Editace přepravce';

			$scope.save = function () {
				if (this.form.$invalid) {
					return;
				}

				if ($scope.creatingNew) {
					Carrier.save($scope.carrier).then(function (carrier) {
						notifications.pushForNextRoute({
							message: 'Nový let byl vytvořen.',
							type: 'success'
						});
						$location.path('/admin/carriers/' + carrier._id);
					});
				}
				else {
					$scope.carrier.$update().then(function (carrier) {
						notifications.pushForCurrentRoute({
							message: 'Změny byly uloženy.',
							type: 'success'
						});
						$scope.carrier = carrier;
					});
				}
			};

			$scope.$on('fileSelected', function (event, args) {
				$scope.carrier.logoFile = args.file;
				fileReader.readAsDataURL(args.file);
			});

			$scope.removeLogo = function () {
				$scope.carrier.logo = '';
				$scope.carrier.logoFile = null;
				$scope.logoSrc = '';
			};

			$scope.addLogo = function () {
				angular.element('input[type="file"]').trigger('click');
			};

			$scope.isLogoVisible = function () {
				return $scope.logoSrc.length > 0 && logosPath != $scope.logoSrc;
			};

			$scope.showErrorMessage = function (field, validityType) {
				return field.$error[validityType || 'required'] && field.$dirty;
			};
		}]);
});