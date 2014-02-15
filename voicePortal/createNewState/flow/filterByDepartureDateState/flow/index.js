'use strict';

var vxml = require('vxml'),
	GetDateDtmfFlow = require('../../../../common/getDateDtmfFlow');

var FilterByDepartureDateFlow = vxml.CallFlow.extend({

	constructor: function () {
		FilterByDepartureDateFlow.super.call(this);
	},

	create: function* () {
		var departureTimeFromState = new vxml.State('departureTimeFrom'),
			departureTimeToState = new vxml.State('departureTimeTo');

		departureTimeFromState
			.addNestedCallFlow(new GetDateDtmfFlow('Please enter departure date from as eight digits.'))
			.addOnExitAction(function* (cf, state, event) {
				cf.departureTimeFromFilter = state.nestedCF.getDate();
			})
			.addTransition('continue', departureTimeToState);

		departureTimeToState
			.addNestedCallFlow(new GetDateDtmfFlow('Please enter departure date to as eight digits.'))
			.addOnExitAction(function* (cf, state, event) {
				cf.departureTimeToFilter = state.nestedCF.getDate();
			});

		this
			.addState(departureTimeFromState)
			.addState(departureTimeToState);
	}
});

module.exports = FilterByDepartureDateFlow;
