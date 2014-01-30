'use strict';

var vxml = require('vxml');

var GetDateState = vxml.State.extend({
	
	constructor: function (id, askDatePrompt) {
		GetDateState.super.call(this, id);

		this.askDatePrompt = askDatePrompt;
	},

	createModel: function () {
		return new vxml.Ask({
			prompt: this.askDatePrompt,
			grammar: new vxml.BuiltinGrammar({
				type: 'digits',
				length: 8
			})
		});
	}
});

module.exports = GetDateState;
