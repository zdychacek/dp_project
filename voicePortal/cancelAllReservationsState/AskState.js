'use strict';

var util = require('util'),
	vxml = require('vxml');

var AskState = function (id, reservations) {
	vxml.State.call(this, id);

	this.reservations = reservations;
}

util.inherits(AskState, vxml.State);

AskState.prototype.createModel = function () {
	var reservationsCount = this.reservations.length;

	return new vxml.Ask({
		prompt: 'You have ' + reservationsCount + ' active reservations. Do you want to cancel them all? Press one for cancel otherwise press two.',
		grammar: new vxml.BuiltinGrammar({ type: 'digits', length: 1 })
	});
};

module.exports = AskState;
