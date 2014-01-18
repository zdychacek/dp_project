'use strict';

var util = require('util'),
	helpers = require('../../lib/helpers'),
	vxml = require('../../lib/vxml');

var GetDateDtmfComponent = function (askDatePrompt) {
	vxml.CallFlow.call(this);

	// entered date
	this.selectedDate = null;
	this.askDatePrompt = askDatePrompt;
}

util.inherits(GetDateDtmfComponent, vxml.CallFlow);

GetDateDtmfComponent.prototype.create = function *() {
	// 1. get an input
	this.addState(
		vxml.ViewStateBuilder.create('getDate', new vxml.Ask({
			prompt: this.askDatePrompt,
			grammar: new vxml.BuiltinGrammar({
				type: 'digits',
				length: 8
			})
		}), 'validateDate')
	);

	// 2. validate date
	this.addState(
		new vxml.State('validateDate')
			.addTransition('continue', 'confirmDate')
			.addTransition('error', 'invalidDate')
			.addOnEntryAction(function* (cf, state, event) {
					var result = cf.validateDate(event.data);

					if (result.isValid) {
						cf.selectedDate = result.date;
						cf.voiceDate = cf.convert(result.date);

						yield cf.fireEvent('continue');
					}
					else {
						yield cf.fireEvent('error');
					}
			})
	);

	// build confirmation prompt
	var confirmPrompt = new vxml.Prompt();
	confirmPrompt.audios = [
		new vxml.TtsMessage('You Entered '),
		new vxml.TtsMessage(new vxml.Var(this, 'voiceDate.day', ' ')),
		new vxml.TtsMessage(new vxml.Var(this, 'voiceDate.month', ' ')),
		new vxml.TtsMessage(new vxml.Var(this, 'voiceDate.year')),
		new vxml.Silence(1000)
	];
	confirmPrompt.bargein = false;

	// 3.1 say date confirmation
	this.addState(
		vxml.ViewStateBuilder.create('confirmDate', new vxml.Say(confirmPrompt))
	);

	// 3.2 invalid date entered
	this.addState(
		vxml.ViewStateBuilder.create('invalidDate', new vxml.Say('You entered and invalid date.'), 'getDate')
	);
};

GetDateDtmfComponent.prototype.getDate = function () {
	return this.selectedDate;
};

GetDateDtmfComponent.prototype.validateDate = function (sDate) {
	var day = sDate.substr(0, 2),
		month = sDate.substr(2, 2),
		year = sDate.substr(4, 4);

	var daysInMonth = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

	/* jshint ignore:start */
	if ((!(year % 4) && year % 100) || !(year % 400)) {
		daysInMonth[1] = 29;
	}
	/* jshint ignore:end */

	return {
		date: new Date(year, month - 1, day),
		isValid: (day <= daysInMonth[--month])
	};
};

GetDateDtmfComponent.prototype.convert = function (date) {
	var months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

	return {
		day: date.getDate(),
		month: months[date.getMonth()],
		year: date.getFullYear()
	};
};

module.exports = GetDateDtmfComponent;
