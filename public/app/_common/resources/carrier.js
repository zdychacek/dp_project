define([
	'angular',
	'_common/resources/resource'
], function (angular) {
	'use strict';

	angular.module('resources.carrier', ['resources.resource'])
		.factory('Carrier', ['resource', '$http', function (resource, $http) {
			var Carrier = resource('carriers');

			function _doRequest (method, url, data) {
				return $http({
					method: method,
					url: url,
					headers: {
						'Content-Type': undefined
					},
					transformRequest: function (data) {
						var formData = new FormData();

						if (data.logoFile) {
							formData.append('logoFile', data.logoFile);
							delete data.logoFile;
						}

						formData.append('data', angular.toJson(data));

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
