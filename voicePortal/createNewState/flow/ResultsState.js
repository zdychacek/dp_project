'use strict';

var	vxml = require('vxml');

var ResultsState = vxml.State.extend({

	constructor: function (id, resultsVar) {
		ResultsState.super.call(this, id);

		this.resultsVar = resultsVar;
	},

	createModel: function (cf) {
		var prompt = new vxml.Prompt();

		prompt.audios = [
			new vxml.TtsMessage('Results: '),
			this.resultsVar
		];

		return new vxml.Say(prompt);
	}
});

module.exports = ResultsState;
