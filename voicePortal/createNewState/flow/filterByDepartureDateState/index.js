'use strict';

var vxml = require('vxml'),
	FilterByDepartureDateFlow = require('./flow');

var FilterByDepartureDateState = vxml.State.extend({

	constructor: function (id) {
		FilterByDepartureDateState.super.call(this, id);

		this.addNestedCallFlow(new FilterByDepartureDateFlow());
	},

	onExit: function* (cf, state, event) {
		cf.filters['departureTimeFrom'] = state.nestedCF.departureTimeFromFilter;
		cf.filters['departureTimeTo'] = state.nestedCF.departureTimeToFilter;
	}
});

module.exports = FilterByDepartureDateState;
