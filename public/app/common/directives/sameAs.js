define(['angular'], function (angular) {
	'use strict';

	angular.module('directives.sameAs', [])
		.directive('sameAs', ['$parse', function ($parse) {
			return {
				require: 'ngModel',
				link: function (scope, elm, attrs, ctrl) {
					ctrl.$parsers.unshift(function (viewValue) {
						console.log($parse(attrs.sameAs)(scope))
						if (viewValue === $parse(attrs.sameAs)(scope)) {
							ctrl.$setValidity('sameAs', true);

							return viewValue;
						}
						else {
							ctrl.$setValidity('sameAs', false);
							
							return undefined;
						}
					});
				}
			};
		}]);
});