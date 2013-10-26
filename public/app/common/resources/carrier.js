define([
	'angular',
	'common/resources/resource'
], function (angular) {
	'use strict';
	
	angular.module('resources.carrier', ['resources.resource'])
		.factory('Carrier', ['resource', '$http', function (resource, $http) {
			var Carrier = resource('/api/v1/carriers');
			
			Carrier.save = function (data) {
				return $http({
					method: 'POST',
					url: this.getResourceUrl(),
					headers: {
						'Content-Type': false
					},
					transformRequest: function (data) {
						var formData = new FormData(),
							logoFile;

						if (data.logo instanceof window.File) {
							logoFile = data.logo;
							data.logo = logoFile.name;
						}
						
						formData.append('data', angular.toJson(data));
						formData.append('logoFile', logoFile);

						return formData;
					},
					data: data
				}).then(function (response) {
					return Carrier._parseResponse(response);
				});				
			};

			return Carrier;
		}]);
});