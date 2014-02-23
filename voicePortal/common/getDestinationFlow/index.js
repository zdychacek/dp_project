'use strict';

var vxml = require('vxml'),
	DestinationSelectionState = require('./destinationSelectionState'),
	GetInputState = require('./getInputState');

var GetDestinationFlow = vxml.CallFlow.extend({

	constructor: function (prompt) {
		GetDestinationFlow.super.call(this);

		this._prompt = prompt;
		this._input = '';
		this._selectedItem = null;
		this._filteredItems = [];
	},

	create: function* () {
		var inputPrompt = new vxml.Prompt([
			new vxml.TtsMessage('You\'ve entere following: '),
			new vxml.Var(this, function () {
				// alter input to force interpreter to spell it
				return (this._input || '').split('').join(' ');
			}),
			new vxml.TtsMessage('. Is it what you want? Press one if yes, otherwise press two.')
		]);

		var getInputState = new GetInputState('getInput', this._prompt),
			showInput = vxml.State.create('showInput', new vxml.Ask({
				prompt: inputPrompt,
				grammar: new vxml.BuiltinGrammar({ type: 'digits', length: 1 })
			})),
			destinationSelectionState = new DestinationSelectionState('destinationSelection', new vxml.Var(this, '_filteredItems'));

		getInputState
			.addTransition('continue', showInput)
			.addTransition('nomatch', getInputState)
			.addTransition('noinput', getInputState);

		showInput
			.addTransition('continue', destinationSelectionState, function (result) { return result == 1; })
			.addTransition('continue', getInputState, function (result) { return result == 2; });

		// register states
		this
			.addState(getInputState)
			.addState(showInput)
			.addState(destinationSelectionState);
	},

	getSelectedDestination: function () {
		return this._selectedItem;
	}
});

module.exports = GetDestinationFlow;
