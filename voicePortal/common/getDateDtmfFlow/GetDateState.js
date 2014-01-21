'use strict';

var util = require('util'),
	vxml = require('../../../lib/vxml');

var GetDateState = function (id, askDatePrompt) {
	vxml.State.call(this, id);

	this.askDatePrompt = askDatePrompt;
}

util.inherits(GetDateState, vxml.State);

GetDateState.prototype.createModel = function () {
	return new vxml.Ask({
		prompt: this.askDatePrompt,
		grammar: new vxml.BuiltinGrammar({
			type: 'digits',
			length: 8
		})
	});
};

module.exports = GetDateState;
