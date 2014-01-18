'use strict';

var util = require('util'),
	User = require('../../models/User'),
	helpers = require('../../lib/helpers'),
	vxml = require('../../lib/vxml');

var LoginFlow = function () {
	vxml.CallFlow.call(this);

	this._loginResult = null;
}

util.inherits(LoginFlow, vxml.CallFlow);

LoginFlow.prototype.create = function* () {
	var login = null;

	// 1. get user login
	this.addState(
		vxml.ViewStateBuilder.create('getLogin', new vxml.Ask({
			prompt: 'Enter your login.',
			grammar: new vxml.BuiltinGrammar({ type: 'digits', length: 6 })
		}), 'getPassword')
		.addOnExitAction(function* (cf, state, event) {
			login = event.data;
		})
	);

	// 2. get user password
	this.addState(
		vxml.ViewStateBuilder.create('getPassword', new vxml.Ask({
			prompt: 'Enter your password.',
			grammar: new vxml.BuiltinGrammar({ type: 'digits', length: 6 })
		}))
		.addOnExitAction(function* (cf, state, event) {
			cf._loginResult = yield User.tryLogin(login, event.data);
		})
	);
};

LoginFlow.prototype.getLoginResult = function* () {
	return this._loginResult;
};

module.exports = LoginFlow;
