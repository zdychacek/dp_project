define(['angular'], function (angular) {
	'use strict';

	angular.module('resources.resource', [])
		.factory('resource', ['$http', function ($http) {
			return function (baseUrl) {
				// .ctor
				var Resource = function (data) {
					angular.extend(this, data);
				};

				// resource URL
				if (baseUrl[baseUrl.length - 1] == '/') {
					baseUrl = baseUrl.substring(0, baseUrl.length - 1);
				}
				Resource._resourceUrl = baseUrl;

				Resource.query = function (params) {
					return $http.get(Resource._resourceUrl, {
						params: params || {}
					})
						.then(function (response) {
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
								items[key] = new Resource(value);
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

					if ('id' in params) {
						url += '/' + params.id;
						delete params.id;
					}

					return $http.get(url, {
						params: params || {}
					})
						.then(function (response) {
							return new Resource(response.data);
						});
				};

				Resource.save = function (data) {
					return $http.post(this.getResourceUrl(), data)
						.then(function (response) {
							return new Resource(response.data);
						});
				};

				Resource.update = function (data) {
					return $http.put(this.getResourceUrl(), data)
						.then(function (response) {
							return new Resource(response.data);
						});
				};

				Resource.remove = function (data) {
					return $http.delete(this.getResourceUrl())
						.then(function (response) {
							return new Resource(response.data);
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
					return this._id;
				};

				Resource.prototype.getResourceUrl = function () {
					return Resource.getResourceUrl();
				};

				return Resource;
		};
	}]);
});