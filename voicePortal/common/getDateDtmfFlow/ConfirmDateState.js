'use strict';

var util = require('util'),
	vxml = require('vxml');

var ConfirmDateState = function (id) {
	vxml.State.call(this, id);
}

util.inherits(ConfirmDateState, vxml.State);

ConfirmDateState.prototype.createModel = function (cf) {
	var confirmPrompt = new vxml.Prompt();

	confirmPrompt.audios = [
		new vxml.TtsMessage('You Entered '),
		new vxml.Var(cf, 'voiceDate.day', ' '),
		new vxml.Var(cf, 'voiceDate.month', ' '),
		new vxml.Var(cf, 'voiceDate.year'),
		new vxml.Silence(1000)
	];
	confirmPrompt.bargein = false;

	return new vxml.Say(confirmPrompt);
};

module.exports = ConfirmDateState;
