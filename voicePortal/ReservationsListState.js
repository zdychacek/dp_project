'use strict';

var util = require('util'),
	vxml = require('../lib/vxml');

var ReservationsListState = function (id) {
	vxml.State.call(this, id);

	this.setModel(
		new vxml.Say('ReservationsListState menu')
	);
}

util.inherits(ReservationsListState, vxml.State);

module.exports = ReservationsListState;
