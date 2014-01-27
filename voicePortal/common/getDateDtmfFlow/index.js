'use strict';

var util = require('util'),
	vxml = require('vxml'),

	GetDateState = require('./GetDateState'),
	ValidateDateState = require('./ValidateDateState'),
	ConfirmDateState = require('./ConfirmDateState');

var GetDateDtmfFlow = function (askDatePrompt) {
	vxml.CallFlow.call(this);

	// entered date
	this.selectedDate = null;
	this.voiceDate = null;
	this.askDatePrompt = askDatePrompt;
}

util.inherits(GetDateDtmfFlow, vxml.CallFlow);

GetDateDtmfFlow.prototype.create = function* () {
	var getDateState = new GetDateState('getDate', this.askDatePrompt),
		validateDateState = new ValidateDateState('validateDate'),
		confirmDateState = new ConfirmDateState('confirmDate'),
		invalidDateState = vxml.State.create('invalidDate', new vxml.Say('You entered and invalid date.'));

	// add transitions
	getDateState.addTransition('continue', validateDateState);
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
};

GetDateDtmfFlow.prototype.getDate = function () {
	return this.selectedDate;
};

module.exports = GetDateDtmfFlow;
