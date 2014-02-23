'use strict';

var vxml = require('vxml'),
	ReservationMenuFlow = require('./flow');

var ReservationMenuState = vxml.State.extend({

	constructor: function (id, user, io, options) {
		ReservationMenuState.super.call(this, id);

		this._reservation = null;

		this.addNestedCallFlow(new ReservationMenuFlow(new vxml.Var(this, '_reservation'), user, io, options));
	},

	setReservationState: function (state) {
		this._reservation = state.getReservation();

		// set transition to back
		this.removeTransitions();
		this.addTransition('continue', state);
	}
});

module.exports = ReservationMenuState;
