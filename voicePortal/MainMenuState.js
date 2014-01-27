'use strict';

var vxml = require('vxml'),
	config = require('./config');

var MainMenuState = vxml.State.extend({

	constructor: function (id, menuDef) {
		MainMenuState.super.call(this, id);

		this._menuDef = menuDef;
	},

	createModel: function () {
		var menuOptionsPrompt = new vxml.Prompt();

		// Build the prompts for the menu options form the meta-data
		this._menuDef.forEach(function (option, index) {
			var number = index + 1;

			menuOptionsPrompt.audios.push(
				new vxml.TtsMessage(option.prompt + this._getSelectionPrompt(number) + ' ')
			);

			// Add the transitions to the state
			this.addTransition('continue', option.targetState, function (result) {
				return result == number;
			});
		}, this);

		return new vxml.Ask({
			prompt: menuOptionsPrompt,
			grammar: new vxml.BuiltinGrammar({ type: 'digits', length: 1 })
		});
	},

	_getSelectionPrompt: function (selectNum) {
		var numbers = [ 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine' ];

		return ', press ' + numbers[selectNum] + '.';
	}
});

module.exports = MainMenuState;
