define(['angular'], function (angular) {
	'use strict';
	
	angular.module('services.breadcrumbs', [])
		.factory('breadcrumbs', ['$rootScope', '$location', function ($rootScope, $location) {
			var breadcrumbs = [],
				breadcrumbsService = {};

			//we want to update breadcrumbs only when a route is actually changed
			//as $location.path() will get updated imediatelly (even if route change fails!)
			$rootScope.$on('$routeChangeSuccess', function (event, current) {
				var pathElements = $location.path().split('/'),
					result = [],
					breadcrumbPath = function (index) {
						return '/' + (pathElements.slice(0, index + 1)).join('/');
					};

				pathElements.shift();

				for (var i = 0, l = pathElements.length; i < l; i++) {
					result.push({
						name: pathElements[i],
						path: breadcrumbPath(i)
					});
				}

				breadcrumbs = result;
			});

			breadcrumbsService.getAll = function() {
				return breadcrumbs;
			};

			breadcrumbsService.getFirst = function() {
				return breadcrumbs[0] || {};
			};

			return breadcrumbsService;
		}]);
});