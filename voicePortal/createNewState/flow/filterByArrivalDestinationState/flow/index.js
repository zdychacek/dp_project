'use strict';

var vxml = require('vxml'),
	GetTextInputDtmfFlow = require('../../../../common/getTextInputDtmfFlow');

var FilterByArrivalDestinationFlow = vxml.CallFlow.extend({

	constructor: function () {
		FilterByArrivalDestinationFlow.super.call(this);

		this.arrivalDestination = null;
	},

	create: function* () {
		var inputPrompt = new vxml.Prompt();
		inputPrompt.audios = [
			new vxml.TtsMessage('You\'ve entere following: '),
			new vxml.Var(this, 'arrivalDestination')
		];

		var getInputState = new vxml.State('getInput'),
			showInput = vxml.State.create('showInput', new vxml.Say(inputPrompt));

		getInputState
			.addNestedCallFlow(new GetTextInputDtmfFlow('Please typed in arrival destination like you\'re writing SMS.'))
			.addOnExitAction(function* (cf, state, event) {
				cf.arrivalDestination = state.nestedCF.getInput();
			})
			.addTransition('continue', showInput);

		this
			.addState(getInputState)
			.addState(showInput);
	}
});

module.exports = FilterByArrivalDestinationFlow;
