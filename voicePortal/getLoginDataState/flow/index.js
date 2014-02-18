'use strict';

var vxml = require('vxml'),
	GetLoginState = require('./GetLoginState'),
	ConfirmLoginState = require('./ConfirmLoginState'),
	GetPasswordState = require('./GetPasswordState');

var GetLoginDataFlow = vxml.CallFlow.extend({

	constructor: function () {
		GetLoginDataFlow.super.call(this);

		this._enteredLogin = null;
		this._enteredPassword = null;
	},

	create: function* () {
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
	},

	getUserLoginData: function () {
		return {
			login: this._enteredLogin,
			password: this._enteredPassword
		}
	}
});

module.exports = GetLoginDataFlow;
