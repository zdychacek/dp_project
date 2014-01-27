'use strict';

var util = require('util'),
	vxml = require('vxml'),
	config = require('./config');

var MainMenuState = function (id, menuDef) {
	vxml.State.call(this, id);

	this._menuDef = menuDef;
}

util.inherits(MainMenuState, vxml.State);

MainMenuState.prototype.createModel = function () {
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
};

MainMenuState.prototype._getSelectionPrompt = function(selectNum) {
	var numbers = [ 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine' ];

	return ', press ' + numbers[selectNum] + '.';
};

module.exports = MainMenuState;
