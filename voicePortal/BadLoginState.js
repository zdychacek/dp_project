'use strict';

var util = require('util'),
	vxml = require('vxml'),
	AskWithNoInputPrompt = require('./common/AskWithNoInputPrompt');

var BadLoginState = function (id) {
	vxml.State.call(this, id);
}

util.inherits(BadLoginState, vxml.State);

BadLoginState.prototype.createModel = function () {
	var badLoginPrompt = new vxml.Prompt();

	badLoginPrompt.audios = [
		new vxml.TtsMessage('You\'ve entered bad login information.'),
		new vxml.Silence('weak'),
		new vxml.TtsMessage('Press one if you would like to try it again, otherwise press two.')
	];

	return new AskWithNoInputPrompt({
		prompt: badLoginPrompt,
		grammar: new vxml.BuiltinGrammar({ type: 'digits', length: 1 })
	});
};

BadLoginState.prototype.onEntryAction = function* (cf, state, event) {
	console.log('errors:', event.data);
};

module.exports = BadLoginState;
