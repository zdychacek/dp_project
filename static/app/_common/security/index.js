// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
define([
	'angular',
	'_common/security/security',
	'_common/security/authorization',
	'_common/security/retryQueue',
	'_common/security/interceptor',
	'_common/security/login/login',
], function (angular) {
	'use strict';

	angular.module('security', [
		'security.service',
		'security.interceptor',
		'security.login',
		'security.authorization'
	]);
});
