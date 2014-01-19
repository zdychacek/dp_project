'use strict';

var util = require('util'),
	vxml = require('../lib/vxml');

var MakeNewReservationState = function (id) {
	vxml.State.call(this, id);

	this.setModel(
		new vxml.Say('MakeNewReservationState menu')
	);
}

util.inherits(MakeNewReservationState, vxml.State);

module.exports = MakeNewReservationState;
