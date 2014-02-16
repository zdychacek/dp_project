'use strict';

var vxml = require('vxml'),
	ReservationMenuFlow = require('./flow');

var ReservationMenuState = vxml.State.extend({

	constructor: function (reservation, user, io, options) {
		ReservationMenuState.super.call(this, 'reservationMenu_' + reservation._id);

		this.addNestedCallFlow(new ReservationMenuFlow(reservation, user, io, options));
	}
});

module.exports = ReservationMenuState;
