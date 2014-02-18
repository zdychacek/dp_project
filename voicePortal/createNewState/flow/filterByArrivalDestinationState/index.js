'use strict';

var vxml = require('vxml'),
	GetDestinationFlow = require('../../../common/getDestinationFlow');

var FilterByArrivalDestinationState = vxml.State.extend({

	constructor: function (id) {
		FilterByArrivalDestinationState.super.call(this, id);

		this.addNestedCallFlow(new GetDestinationFlow('Please typed in arrival destination like you\'re writing SMS.'));
	},

	onExit: function* (cf, state, event) {
		cf.addFilter('toDestination', state.nestedCF.getSelectedDestination());
	}
});

module.exports = FilterByArrivalDestinationState;
