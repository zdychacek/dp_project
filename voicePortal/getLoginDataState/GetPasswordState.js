'use strict';

var util = require('util'),
	vxml = require('../../lib/vxml'),
	AskWithNoInputPrompt = require('../common/AskWithNoInputPrompt'),
	config = require('./../config');

var GetPasswordState = function (id) {
	vxml.State.call(this, id);
}

util.inherits(GetPasswordState, vxml.State);

GetPasswordState.prototype.createModel = function () {
	return new AskWithNoInputPrompt({
		prompt: 'Please enter your password as five digits.',
		grammar: new vxml.BuiltinGrammar({ type: 'digits', minLength: 1, maxLength: config.passwordLength })
	});
};

GetPasswordState.prototype.onExitAction = function* (cf, state, event) {
	// remember entered password
	cf.enteredPassword = event.data;
};

module.exports = GetPasswordState;
