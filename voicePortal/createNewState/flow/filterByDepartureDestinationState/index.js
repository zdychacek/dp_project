'use strict';

var vxml = require('vxml'),
	GetDestinationFlow = require('../../../common/getDestinationFlow');

var FilterByDepartureDestinationState = vxml.State.extend({

	constructor: function (id) {
		FilterByDepartureDestinationState.super.call(this, id);

		this.addNestedCallFlow(new GetDestinationFlow('Please typed in departure destination like you\'re writing SMS.'));
	},

	onExit: function* (cf, state, event) {
		cf.addFilter('fromDestination', state.nestedCF.getSelectedDestination());
	}
});

module.exports = FilterByDepartureDestinationState;
