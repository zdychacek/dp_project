define([
	'angular',
	'spin'
], function (angular, Spinner) {
	'use strict';

	angular.module('directives.spinner', [])
		.directive('spinner', ['$parse', function ($parse) {
			return {
				restrict: 'EA',
				replace: true,
				link: function (scope, element, attrs) {
					var options = {};

					if (attrs.size) {
						switch (attrs.size) {
							case 'small':
								angular.extend(options, {
									radius: 6,
									length: 7,
									width: 2
								});
								break;
						}
					}
					else {
						angular.extend(options, {
							radius: 30,
							length: 20,
							width: 10
						});
					}

					if (attrs.color) {
						angular.extend(options, {
							color: attrs.color
						});
					}

					var spinner = new Spinner(options);
					
					if (attrs.show) {
						scope.$watch($parse(attrs.show), function (value) {
							if (value) {
								spinner.spin(element[0]);

								if (attrs.align == 'center') {
									angular.element(spinner.el).css({
										position: 'absolute',
										top: '50%',
										left: '50%'
									});
								}
							}
							else {
								spinner.stop();
							}
						});
					}
				}
			};
		}]);
});