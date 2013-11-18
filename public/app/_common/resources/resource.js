define([
	'angular',
	'config'
], function (angular) {
	'use strict';

	angular.module('resources.resource', ['app.config'])
		.factory('resource', ['$http', 'config', function ($http, config) {
			return function (baseUrl, options) {
				options || (options = {});

				// .ctor
				var Resource = function (data) {
					if (typeof options.fromServerConverter === 'function') {
						data = options.fromServerConverter(data);
					}

					angular.extend(this, data);
				};

				// pokud URL nezacina lomitkem, tak pridam za base url z configu
				if (baseUrl[0] != '/') {
					baseUrl = config.baseRestApiUrl + '/' + baseUrl;
				}

				// pripadne odseknuti posledniho lomitka
				if (baseUrl[baseUrl.length - 1] == '/') {
					baseUrl = baseUrl.substring(0, baseUrl.length - 1);
				}
				Resource._resourceUrl = baseUrl;

				Resource.idField = '_id';

				Resource._parseResponse = function (response) {
					var data = response.data;

					if (typeof data === 'object') {
						return new Resource(data);
					}
					else {
						return null;
					}
				};

				Resource.query = function (params) {
					return $http.get(Resource._resourceUrl, {
						params: params || {}
					}).then(function (response) {
						var data = response.data,
							collectionToIterate,
							metadata = data.metadata,
							items = [];

						if (angular.isArray(data)) {
							collectionToIterate = data;
						}
						else if (angular.isArray(data.items)) {
							collectionToIterate = data.items;
						}
						else {
							throw new Error('Resource.query(): Missing items collection.');
						}

						// vytvoreni jednotlivych instanci
						angular.forEach(collectionToIterate, function (value, key) {
							if (typeof value === 'object') {
								items[key] = new Resource(value);
							}
							// primitivni hodnoty
							else {
								items[key] = value;
							}
						});

						if (metadata) {
							return {
								items: items,
								metadata: metadata
							};
						}
						else {
							return items;
						}
					});
				};

				Resource.getResourceUrl = function () {
					return Resource._resourceUrl;
				};

				Resource.get = function (params) {
					var url = this.getResourceUrl();

					if (Resource.idField in params) {
						url += '/' + params[Resource.idField];
						delete params[Resource.idField];
					}

					return $http.get(url, {
						params: params || {}
					}).then(function (response) {
						return Resource._parseResponse(response);
					});
				};

				Resource.save = function (data) {
					return $http.post(this.getResourceUrl(), data)
					.then(function (response) {
						return Resource._parseResponse(response);
					});
				};

				Resource.update = function (data) {
					var url = this.getResourceUrl();

					if (Resource.idField in data) {
						url += '/' + data[Resource.idField];
						delete data[Resource.idField];
					}

					return $http.put(url, data)
					.then(function (response) {
						return Resource._parseResponse(response);
					});
				};

				Resource.remove = function (params) {
					var url = this.getResourceUrl();

					if (Resource.idField in params) {
						url += '/' + params[Resource.idField];
						delete params[Resource.idField];
					}

					return $http.delete(url, {
						params: params || {}
					}).then(function (response) {
						return Resource._parseResponse(response);
					});
				};

				// intancni metody
				Resource.prototype.$save = function (data) {
					return Resource.save(this);
				};

				Resource.prototype.$update = function (data) {
					return Resource.update(this);
				};

				Resource.prototype.$remove = function (data) {
					return Resource.remove(this);
				};

				Resource.prototype.$id = function () {
					return this[Resource.idField];
				};

				Resource.prototype.getResourceUrl = function () {
					return Resource.getResourceUrl();
				};

				Resource.prototype.getServerErrors = function () {
					return this._errors_;
				};

				return Resource;
		};
	}]);
});
