define(['angular'], function (angular) {
	'use strict';

	angular.module('app.config', [])
		.constant('config', {
			baseRestApiUrl: '/api/v1'
		});
});