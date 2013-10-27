define([
	'angular',
	'common/resources/resource'
], function (angular) {
	'use strict';
	
	angular.module('resources.carrier', ['resources.resource'])
		.factory('Carrier', ['resource', '$http', function (resource, $http) {
			var Carrier = resource('/api/v1/carriers');
			
			function _doRequest (method, url, data) {
				return $http({
					method: method,
					url: url,
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
						
						if (logoFile) {
							formData.append('logoFile', logoFile);
						}

						return formData;
					},
					data: data
				}).then(function (response) {
					return Carrier._parseResponse(response);
				});	
			}

			Carrier.save = function (data) {
				return _doRequest('POST', this.getResourceUrl(), data);
			};

			Carrier.update = function (data) {
				return _doRequest('PUT', this.getResourceUrl() + '/' + data[Carrier.idField], data);
			};

			return Carrier;
		}]);
});