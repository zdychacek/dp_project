'use strict';

var vxml = require('vxml'),
	GetDateState = require('./GetDateState'),
	ValidateDateState = require('./ValidateDateState'),
	ConfirmDateState = require('./ConfirmDateState');

var GetDateDtmfFlow = vxml.CallFlow.extend({

	constructor: function (askDatePrompt) {
		GetDateDtmfFlow.super.call(this);

		// entered date
		this.selectedDate = null;
		this.voiceDate = null;
		this.askDatePrompt = askDatePrompt;
	},

	create: function* () {
		var getDateState = new GetDateState('getDate', this.askDatePrompt),
			validateDateState = new ValidateDateState('validateDate'),
			confirmDateState = new ConfirmDateState('confirmDate'),
			invalidDateState = vxml.State.create('invalidDate', new vxml.Say('You entered an invalid date.'));

		// add transitions
		getDateState
			.addTransition('continue', validateDateState)
			.addTransition('noinput', getDateState)
			.addTransition('nomatch', getDateState);

		validateDateState
			.addTransition('continue', confirmDateState)
			.addTransition('error', invalidDateState);

		invalidDateState.addTransition('continue', getDateState);

		// add states
		this
			// 1. get an input
			.addState(getDateState)
			// 2. validate date
			.addState(validateDateState)
			// 3.1 say date confirmation
			.addState(confirmDateState)
			// 3.2 invalid date entered
			.addState(invalidDateState);
	},

	getDate: function () {
		return this.selectedDate;
	}
});

module.exports = GetDateDtmfFlow;
