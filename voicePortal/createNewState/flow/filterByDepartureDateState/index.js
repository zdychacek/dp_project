'use strict';

var vxml = require('vxml'),
	FilterByDepartureDateFlow = require('./flow');

var FilterByDepartureDateState = vxml.State.extend({

	constructor: function (id) {
		FilterByDepartureDateState.super.call(this, id);

		this.addNestedCallFlow(new FilterByDepartureDateFlow());
	},

	onExit: function* (cf, state, event) {
		cf.addFilter('departureTimeFrom', state.nestedCF.departureTimeFromFilter);
		cf.addFilter('departureTimeTo', state.nestedCF.departureTimeToFilter);
	}
});

module.exports = FilterByDepartureDateState;
