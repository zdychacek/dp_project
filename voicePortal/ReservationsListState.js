'use strict';

var util = require('util'),
	vxml = require('../lib/vxml');

var ReservationsListState = function (id) {
	vxml.State.call(this, id);

	this.setModel(
		new vxml.Say('ReservationsListState menu')
	);

  /* To repeat information, say repeat.
  To go back to main menu, say main menu.
  To exit call, say exit. */
}

util.inherits(ReservationsListState, vxml.State);

module.exports = ReservationsListState;
