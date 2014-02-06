'use strict';

var	vxml = require('vxml');

var GetAnotherFilterInputState = vxml.State.extend({

	constructor: function (id) {
		GetAnotherFilterInputState.super.call(this, id);
	},

	createModel: function () {
		return new vxml.Ask({
			prompt: 'Do you want to set another filter? Press one if so, otherwise press two.',
			grammar: new vxml.BuiltinGrammar({ type: 'digits', length: 1 })
		});
	}
});

module.exports = GetAnotherFilterInputState;
