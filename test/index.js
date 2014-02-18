'use strict';

var vxml = require('vxml'),
	GetDestinationFlow = require('../voicePortal/common/getDestinationFlow');

var TestFlow = vxml.CallFlow.extend({

	constructor: function (app) {
		TestFlow.super.call(this);
	},

	create: function* () {
		var getDestinationState = new vxml.State('getDestination');

		getDestinationState
			.addNestedCallFlow(new GetDestinationFlow('Please typed in destination like you\'re writing SMS.'))
			.addOnExitAction(function* (cf, state, event) {
				var selection = state.nestedCF.getSelectedDestination();

				console.log('Selection:', selection);
			})
			.addTransition('continue', getDestinationState);

		this.addState(getDestinationState);
	}
});

module.exports = TestFlow;
