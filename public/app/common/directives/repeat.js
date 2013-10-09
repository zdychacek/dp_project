define(['angular'], function (angular) {
	'use strict';

	angular.module('directives.repeat', [])
		.directive('repeat', function () {
			return {
				require: 'ngModel',
				link: function (scope, elm, attrs, ctrl) {
					var otherInput = elm.inheritedData('$formController')[attrs.repeat];

					ctrl.$parsers.push(function (value) {
						if(value === otherInput.$viewValue) {
							ctrl.$setValidity('repeat', true);
							return value;
						}
						ctrl.$setValidity('repeat', false);
					});

					otherInput.$parsers.push(function(value) {
						ctrl.$setValidity('repeat', value === ctrl.$viewValue);
						return value;
					});
				}
			};
		});
});