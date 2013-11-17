define(['angular'], function (angular) {
	'use strict';

	angular.module('filters.minutesFormatter', [])
		.filter('minutesFormatter', function () {
			return function (minutes) {
				var hoursPart = Math.floor(minutes / 60),
					minutesPart = minutes % 60;

				return hoursPart + 'h ' + minutesPart + 'm';
			};
		});
});
