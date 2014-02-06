'use strict';

var vxml = require('vxml');

var ConfirmLoginState = vxml.State.extend({

	constructor: function (id) {
		ConfirmLoginState.super.call(this, id);
	},

	createModel: function (cf) {
		var loginConfirm = new vxml.Prompt();

		loginConfirm.audios = [
			new vxml.TtsMessage('You has entered following number '),
			new vxml.SayAs(
				new vxml.Var(cf, 'enteredLogin')
			, 'digits'),
			new vxml.TtsMessage('.'),
			new vxml.Silence('weak'),
			new vxml.TtsMessage('Press one if this number is correct. Otherwise, press two.')
		];

		return new vxml.Ask({
			prompt: loginConfirm,
			grammar: new vxml.BuiltinGrammar({ type: 'digits', length: 1 })
		});
	}
});

module.exports = ConfirmLoginState;
