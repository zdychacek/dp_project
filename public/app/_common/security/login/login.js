define([
	'angular',
	'_common/security/login/LoginFormCtrl',
	'_common/security/login/toolbar'
], function (angular) {
	'use strict';

	angular.module('security.login', [
		'security.login.form',
		'security.login.toolbar'
	]);
});
