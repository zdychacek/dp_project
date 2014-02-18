'use strict';

var vxml = require('vxml'),
	ReservationMenuFlow = require('./flow');

var ReservationMenuState = vxml.State.extend({

	constructor: function (reservationVar, user, io, options) {
		ReservationMenuState.super.call(this, 'reservationMenu');

		this.addNestedCallFlow(new ReservationMenuFlow(reservationVar, user, io, options));
	},

	setExitTransition: function (state) {
		this.removeTransitions();
		this.addTransition('continue', state);
	}
});

module.exports = ReservationMenuState;
