'use strict';

var vxml = require('vxml'),
	Destination = require('../models/Destination'),
	GetTextInputDtmfFlow = require('../voicePortal/common/getTextInputDtmfFlow'),
	DestinationSelectionFlow = require('../voicePortal/common/DestinationSelectionFlow');

var TestFlow = vxml.CallFlow.extend({

	constructor: function (app) {
		TestFlow.super.call(this);
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
			resultsState = vxml.State.create('results', new vxml.Say('Results...'));

		getInputState
			.addNestedCallFlow(new GetTextInputDtmfFlow('Please typed in arrival destination like you\'re writing SMS.'))
			.addOnExitAction(function* (cf, state, event) {
				cf.input = state.nestedCF.getInput();
				cf.filteredItems = yield Destination.filter(cf.input, true);
			})
			.addTransition('continue', showInput);

		showInput
			.addTransition('continue', resultsState, function (result) { return result == 1; })
			.addTransition('continue', getInputState, function (result) { return result == 2; });

		resultsState
			.addNestedCallFlow(new DestinationSelectionFlow(new vxml.Var(this, 'filteredItems')))
			.addTransition('continue', getInputState);

		// register states
		this
			.addState(getInputState)
			.addState(showInput)
			.addState(resultsState);
	}
});

module.exports = TestFlow;
