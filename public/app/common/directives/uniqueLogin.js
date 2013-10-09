define([
  'angular'
], function (angular) {
  'use strict';

	angular.module('directives.uniqueLogin', [])
		.directive('uniqueLogin', ['$http', function ($http) {
			var toId;

			return {
				restrict: 'A',
				require: 'ngModel',
				link: function (scope, elem, attr, ctrl) { 
					scope.$watch(attr.ngModel, function (value) {
						if (toId) {
							clearTimeout(toId);
						}

						toId = setTimeout(function () {
							$http.get('/api/v1/users/checkLogin/?login=' + value).success(function (data) {
								//scope.$apply(function (s) {
									ctrl.$setValidity('uniqueLogin', data.isValid);               
								//});
							});
						}, 200);
					});
				}
			};
		}]);
});