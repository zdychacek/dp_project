'use strict';

var vxml = require('vxml'),
	Destination = require('../../../../models/Destination'),
	GetTextInputDtmfFlow = require('../../getTextInputDtmfFlow');

var GetInputState = vxml.State.extend({

	constructor: function (id, prompt) {
		GetInputState.super.call(this, id);

		this.addNestedCallFlow(new GetTextInputDtmfFlow(prompt));
	},

	onExit: function* (cf, state, event) {
		cf._input = state.nestedCF.getInput();
		cf._filteredItems = yield Destination.filter(cf._input, true);
	}
});

module.exports = GetInputState;
