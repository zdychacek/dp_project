'use strict';

var vxml = require('vxml');

var GetTextInputDtmfFlow = vxml.CallFlow.extend({

	constructor: function (promptText) {
		GetTextInputDtmfFlow.super.call(this);

		this._input = null;
		this._promptText = promptText;
	},

	keywordMap: {
		0: [ '0' ],
		1: [ ' ', '1' ],
		2: [ 'a', 'b', 'c', '2' ],
		3: [ 'd', 'e', 'f', '3' ],
		4: [ 'g', 'h', 'i', '4' ],
		5: [ 'j', 'k', 'l', '5' ],
		6: [ 'm', 'n', 'o', '6' ],
		7: [ 'p', 'q', 'r', 's', '7' ],
		8: [ 't', 'u', 'v', '8' ],
		9: [ 'w', 'x', 'y', 'z', '9']
	},

	skipChar: '*',

	create: function* () {
		var askForInputState = vxml.State.create('askForInput', new vxml.Ask({
			prompt: this._promptText,
			grammar: new vxml.BuiltinGrammar({ type: 'digits' })
		}));

		askForInputState.addOnExitAction(function* (cf, state, event) {
			cf._input = cf._decodeDtmfInput(event.data);
		});

		this.addState(askForInputState);
	},

	_decodeDtmfInput: function (dtmfInput) {
		var decoded = '',
			prevChar = dtmfInput.charAt(0),
			counter = 0;

		for (var i = 1, l = dtmfInput.length; i <= l; i++) {
			var char = dtmfInput.charAt(i);
	
			if (char === prevChar) {
				counter++;
				prevChar = char;
			}
			else if (prevChar in this.keywordMap) {
				var charLength = this.keywordMap[prevChar].length;

				decoded += this.keywordMap[prevChar][counter % charLength];
				counter = 0;
				prevChar = char;
			}
			else if (prevChar == this.skipChar) {
				 counter = 0;
				 prevChar = char;
			}
		}
		
		return decoded;
	},

	getInput: function () {
		return this._input;
	}
});

module.exports = GetTextInputDtmfFlow;
