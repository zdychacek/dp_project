'use strict';

var vxml = require('vxml'),
	AskWithNoInputPrompt = require('../common/AskWithNoInputPrompt'),
	config = require('./../config');

var GetPasswordState = vxml.State.extend({

	constructor: function (id) {
		GetPasswordState.super.call(this, id);
	},

	createModel: function () {
		return new AskWithNoInputPrompt({
			prompt: 'Please enter your password as five digits.',
			grammar: new vxml.BuiltinGrammar({ type: 'digits', minLength: 1, maxLength: config.passwordLength })
		});
	},

	onExitAction: function* (cf, state, event) {
		// remember entered password
		cf.enteredPassword = event.data;
	}
});

module.exports = GetPasswordState;
