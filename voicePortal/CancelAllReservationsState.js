'use strict';

var util = require('util'),
	vxml = require('../lib/vxml');

var CancelAllReservationsState = function (id) {
	vxml.State.call(this, id);

	this.setModel(
		new vxml.Say('CancelAllReservationsState menu')
	);
}

util.inherits(CancelAllReservationsState, vxml.State);

module.exports = CancelAllReservationsState;
