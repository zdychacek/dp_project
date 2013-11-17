define([
	'angular',
	'_common/i18n/i18n'
], function (angular) {
	'use strict';

	angular.module('i18n.filter', ['i18n'])
		.filter('i18n', ['i18n', function (i18n) {
			return function (input) {
				return i18n.get(input);
			};
		}]);
});
