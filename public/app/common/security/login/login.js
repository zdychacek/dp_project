define([
	'angular',
	'common/security/login/LoginFormCtrl',
	'common/security/login/toolbar'
], function (angular) {
	'use strict';

	angular.module('security.login', [
		'security.login.form',
		'security.login.toolbar'
	]);
});