'use strict';

var util = require('util'),
	vxml = require('../lib/vxml');

var ReservationsListState = function (id) {
	vxml.State.call(this, id);
}

util.inherits(ReservationsListState, vxml.State);

ReservationsListState.prototype.createModel = function () {
  /* To repeat information, say repeat.
  To go back to main menu, say main menu.
  To exit call, say exit. */
	return new vxml.Say('ReservationsListState menu');
};

module.exports = ReservationsListState;
