'use strict';

var vxml = require('vxml');

var ConfirmDateState = vxml.State.extend({

	constructor: function (id) {
		ConfirmDateState.super.call(this, id);
	},

	createModel: function (cf) {
		var confirmPrompt = new vxml.Prompt([
			new vxml.TtsMessage('You Entered '),
			new vxml.Var(cf, 'voiceDate.day', ' '),
			new vxml.Var(cf, 'voiceDate.month', ' '),
			new vxml.Var(cf, 'voiceDate.year'),
			new vxml.Silence(1000)
		]);

		confirmPrompt.bargein = false;

		return new vxml.Say(confirmPrompt);
	}
});

module.exports = ConfirmDateState;
