// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
define([
	'angular',
	'common/security/security',
	'common/security/authorization',
	'common/security/retryQueue',
	'common/security/interceptor',
	'common/security/login/login',
], function (angular) {
	'use strict';

	angular.module('security', [
		'security.service',
		'security.interceptor',
		'security.login',
		'security.authorization'
	]);
});