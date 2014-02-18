'use strict';

var vxml = require('vxml'),
	DestinationSelectionFlow = require('./flow');

var DestinationSelectionState = vxml.State.extend({

	constructor: function (id, destinationsVar) {
		DestinationSelectionState.super.call(this, id);

		this.addNestedCallFlow(new DestinationSelectionFlow(destinationsVar));
	},

	onExit: function* (cf, state, event) {
		cf._selectedItem = state.nestedCF.selectedItem;
	}
});

module.exports = DestinationSelectionState;
