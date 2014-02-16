'use strict';

var vxml = require('vxml'),
	ReservationMenuFlow = require('./flow');

var ReservationMenuState = vxml.State.extend({
	constructor: function (reservation, options) {
		ReservationMenuState.super.call(this, 'reservationMenu_' + reservation._id);

		this.addNestedCallFlow(new ReservationMenuFlow(reservation, options));
	}
});

module.exports = ReservationMenuState;
