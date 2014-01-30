'use strict';

var vxml = require('vxml'),
	AskWithNoInputPrompt = require('../common/AskWithNoInputPrompt'),
	config = require('./../config');

var GetLoginState = vxml.State.extend({

	constructor: function (id) {
		GetLoginState.super.call(this, id);
	},

	createModel: function () {
		return new AskWithNoInputPrompt({
			prompt: 'Enter your telephone number as six digits.',
			grammar: new vxml.BuiltinGrammar({ type: 'digits', /*length: config.loginLength*/ minLength: 1, maxLength: config.loginLength })
		})
	},

	onExitAction: function* (cf, state, event) {
		// remember entered login
		cf.enteredLogin = event.data;
	}
});

module.exports = GetLoginState;
