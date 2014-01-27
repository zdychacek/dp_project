'use strict';

var util = require('util'),
	vxml = require('vxml'),

	GetLoginState = require('./GetLoginState'),
	ConfirmLoginState = require('./ConfirmLoginState'),
	GetPasswordState = require('./GetPasswordState');

var GetLoginDataFlow = function () {
	vxml.CallFlow.call(this);

	this.enteredLogin = null;
	this.enteredPassword = null;
}

util.inherits(GetLoginDataFlow, vxml.CallFlow);

GetLoginDataFlow.prototype.create = function* () {
	var getLoginState = new GetLoginState('getLogin'),
		confirmLoginState = new ConfirmLoginState('confirmLogin'),
		getPasswordState = new GetPasswordState('getPassword');

	getLoginState
		.addTransition('continue', confirmLoginState)
		.addTransition('nomatch', getLoginState)
		.addTransition('noinput', getLoginState);

	confirmLoginState
		.addTransition('continue', getPasswordState, function (result) {
				return result == 1;
			})
		// if user doesn't confirm login, try to get it again
		.addTransition('continue', getLoginState, function (result) {
			return result == 2;
		});

	this
		.addState(getLoginState)
		.addState(confirmLoginState)
		.addState(getPasswordState);
};

GetLoginDataFlow.prototype.getUserLoginData = function () {
	return {
		login: this.enteredLogin,
		password: this.enteredPassword
	}
};

module.exports = GetLoginDataFlow;
