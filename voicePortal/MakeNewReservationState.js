'use strict';

var util = require('util'),
	vxml = require('vxml');

var MakeNewReservationState = function (id) {
	vxml.State.call(this, id);
}

util.inherits(MakeNewReservationState, vxml.State);

MakeNewReservationState.prototype.createModel = function () {
	return new vxml.Say('MakeNewReservationState menu');
}

module.exports = MakeNewReservationState;
