'use strict';

var	vxml = require('vxml');

var ReservationsListState = vxml.State.extend({

	constructor: function (id) {
		ReservationsListState.super.call(this, id);
	},

	createModel: function () {
	  /* To repeat information, say repeat.
	  To go back to main menu, say main menu.
	  To exit call, say exit. */
		return new vxml.Say('ReservationsListState menu');
	}
});

module.exports = ReservationsListState;
