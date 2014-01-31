'use strict';

var vxml = require('vxml'),
	AskWithNoInputPrompt = require('./common/AskWithNoInputPrompt');

var BadLoginState = vxml.State.extend({

	constructor: function (id) {
		BadLoginState.super.call(this, id);
	},

	createModel: function () {
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
	},

	onEntry: function* (cf, state, event) {
		console.log('errors:', event.data);
	}
});

module.exports = BadLoginState;
