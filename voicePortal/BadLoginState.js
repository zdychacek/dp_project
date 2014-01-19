'use strict';

var util = require('util'),
	vxml = require('../lib/vxml'),
	AskWithNoInputPrompt = require('./components/AskWithNoInputPrompt');

var BadLoginState = function (id) {
	vxml.State.call(this, id);

	var badLoginPrompt = new vxml.Prompt();

	badLoginPrompt.audios = [
		new vxml.TtsMessage('You\'ve entered bad login information.'),
		new vxml.Silence('weak'),
		new vxml.TtsMessage('Press one if you would like to try it again, otherwise press two.')
	];

	this.setModel(
		new AskWithNoInputPrompt({
			prompt: badLoginPrompt,
			grammar: new vxml.BuiltinGrammar({ type: 'digits', length: 1 })
		})
	);

	this.addOnEntryAction(this.onEntryAction);
}

util.inherits(BadLoginState, vxml.State);

BadLoginState.prototype.onEntryAction = function* (cf, state, event) {
	console.log('errors:', event.data);
};

module.exports = BadLoginState;
