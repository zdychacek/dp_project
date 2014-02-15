'use strict';

var vxml = require('vxml'),
	GetDateDtmfFlow = require('../../../../common/getDateDtmfFlow');

var FilterByArrivalDateFlow = vxml.CallFlow.extend({

	constructor: function () {
		FilterByArrivalDateFlow.super.call(this);
	},

	create: function* () {
		var arrivalTimeFromState = new vxml.State('arrivalTimeFrom'),
			arrivalTimeToState = new vxml.State('arrivalTimeTo');

		arrivalTimeFromState
			.addNestedCallFlow(new GetDateDtmfFlow('Please enter arrival date from as eight digits.'))
			.addOnExitAction(function* (cf, state, event) {
				cf.arrivalTimeFromFilter = state.nestedCF.getDate();
			})
			.addTransition('continue', arrivalTimeToState);

		arrivalTimeToState
			.addNestedCallFlow(new GetDateDtmfFlow('Please enter arrival date to as eight digits.'))
			.addOnExitAction(function* (cf, state, event) {
				cf.arrivalTimeToFilter = state.nestedCF.getDate();
			});

		this
			.addState(arrivalTimeFromState)
			.addState(arrivalTimeToState);
	}
});

module.exports = FilterByArrivalDateFlow;
