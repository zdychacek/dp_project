'use strict';

var util = require('util'),
	vxml = require('vxml');

var ConfirmLoginState = function (id) {
	vxml.State.call(this, id);
}

util.inherits(ConfirmLoginState, vxml.State);

ConfirmLoginState.prototype.createModel = function (cf) {
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
};

module.exports = ConfirmLoginState;
