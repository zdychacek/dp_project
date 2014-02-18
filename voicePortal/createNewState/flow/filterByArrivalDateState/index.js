'use strict';

var vxml = require('vxml'),
	FilterByArrivalDateFlow = require('./flow');

var FilterByArrivalDateState = vxml.State.extend({

	constructor: function (id) {
		FilterByArrivalDateState.super.call(this, id);

		this.addNestedCallFlow(new FilterByArrivalDateFlow());
	},

	onExit: function* (cf, state, event) {
		cf.addFilter('arrivalTimeFrom', state.nestedCF.arrivalTimeFromFilter);
		cf.addFilter('arrivalTimeTo', state.nestedCF.arrivalTimeToFilter);
	}
});

module.exports = FilterByArrivalDateState;
