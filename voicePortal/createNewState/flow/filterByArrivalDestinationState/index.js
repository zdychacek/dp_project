'use strict';

var vxml = require('vxml'),
	FilterByArrivalDestinationFlow = require('./flow');

var FilterByArrivalDestinationState = vxml.State.extend({

	constructor: function (id) {
		FilterByArrivalDestinationState.super.call(this, id);

		this.addNestedCallFlow(new FilterByArrivalDestinationFlow());
	},

	onExit: function* (cf, state, event) {
		cf.filters['toDestination'] = state.nestedCF.arrivalDestination;
	}
});

module.exports = FilterByArrivalDestinationState;
