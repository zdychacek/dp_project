'use strict';

var vxml = require('vxml'),
	Destination = require('../models/Destination'),
	GetTextInputDtmfFlow = require('../voicePortal/common/getTextInputDtmfFlow');

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
				cf.filtered = yield Destination.filter(cf.input);

				console.log('filtered:', cf.filtered);
			})
			.addTransition('continue', showInput);

		showInput
			.addTransition('continue', resultsState, function (result) { return result == 1; })
			.addTransition('continue', getInputState, function (result) { return result == 2; });

		resultsState.addTransition('continue', getInputState);

		// register states
		this
			.addState(getInputState)
			.addState(showInput)
			.addState(resultsState);

		// cf.arrivalDestination
	}
});

module.exports = TestFlow;
