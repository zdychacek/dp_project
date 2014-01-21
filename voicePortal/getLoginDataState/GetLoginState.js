'use strict';

var util = require('util'),
	vxml = require('../../lib/vxml'),
	AskWithNoInputPrompt = require('../components/AskWithNoInputPrompt'),
	config = require('./../config');

var GetLoginState = function (id) {
	vxml.State.call(this, id);
}

util.inherits(GetLoginState, vxml.State);

GetLoginState.prototype.createModel = function () {
	return new AskWithNoInputPrompt({
		prompt: 'Enter your telephone number as six digits.',
		grammar: new vxml.BuiltinGrammar({ type: 'digits', length: config.loginLength })
	})
};

GetLoginState.prototype.onEntryAction = function* (cf, state, event) {
	// remember entered login
	cf.enteredLogin = event.data;
};

module.exports = GetLoginState;