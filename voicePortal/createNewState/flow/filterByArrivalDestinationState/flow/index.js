'use strict';

var vxml = require('vxml'),
	DestinationSelectionFlow = require('../../../../common/DestinationSelectionFlow'),
	GetTextInputDtmfFlow = require('../../../../common/getTextInputDtmfFlow'),
	Destination = require('../../../../../models/Destination');

var FilterByArrivalDestinationFlow = vxml.CallFlow.extend({

	constructor: function (app) {
		FilterByArrivalDestinationFlow.super.call(this);
	},

	create: function* () {
		var inputPrompt = new vxml.Prompt();
		inputPrompt.audios = [
			new vxml.TtsMessage('You\'ve entere following: '),
			new vxml.Var(this, 'input'),
			new vxml.TtsMessage('. Is it what you want? Press one if yes, otherwise press two.')
		];

		var getInputState = new vxml.State('getInput'),
			showInput = vxml.State.create('showInput', new vxml.Ask({
				prompt: inputPrompt,
				grammar: new vxml.BuiltinGrammar({ type: 'digits', length: 1 })
			})),
			filteredItemsState = vxml.State.create('filteredItems', new vxml.Say('Results...'));

		filteredItemsState
			.addNestedCallFlow(new DestinationSelectionFlow(new vxml.Var(this, 'filteredItems')))
			.addOnExitAction(function* (cf, state, event) {
				cf.arrivalDestination = state.nestedCF.selectedItem;
			});

		getInputState
			.addNestedCallFlow(new GetTextInputDtmfFlow('Please typed in arrival destination like you\'re writing SMS.'))
			.addOnExitAction(function* (cf, state, event) {
				cf.input = state.nestedCF.getInput();
				cf.filteredItems = yield Destination.filter(cf.input, true);
			})
			.addTransition('continue', showInput);

		showInput
			.addTransition('continue', filteredItemsState, function (result) { return result == 1; })
			.addTransition('continue', getInputState, function (result) { return result == 2; });

		// register states
		this
			.addState(getInputState)
			.addState(showInput)
			.addState(filteredItemsState);
	}
})

module.exports = FilterByArrivalDestinationFlow;
