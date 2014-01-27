'use strict';

var util = require('util'),
	vxml = require('vxml');

var AskWithNoInputPrompt = function () {
	// super call
	vxml.Ask.apply(this, arguments);

	// create some no match and no input prompts
	var noInput = new vxml.Prompt('No input! I\'m sorry, I didn\'t get any input. Could you please try that again?'),
		noMatch = new vxml.Prompt('No match! I\'m sorry, I didn\'t understand your input. Could you please try that again?');

	this.nomatchPrompts = [ noMatch, noMatch ];
	this.noinputPrompts = [ noInput, noInput ];
}

util.inherits(AskWithNoInputPrompt, vxml.Ask);

module.exports = AskWithNoInputPrompt;
