'use strict';

var vxml = require('vxml');

var AskWithNoInputPrompt = vxml.Ask.extend({

	constructor: function () {
		AskWithNoInputPrompt.super.apply(this, arguments);

		// create some no match and no input prompts
		var noInput = new vxml.Prompt('No input! I\'m sorry, I didn\'t get any input. Could you please try that again?'),
			noMatch = new vxml.Prompt('No match! I\'m sorry, I didn\'t understand your input. Could you please try that again?');

		this.nomatchPrompts = [ noMatch, noMatch ];
		this.noinputPrompts = [ noInput, noInput ];
	}
});

module.exports = AskWithNoInputPrompt;
