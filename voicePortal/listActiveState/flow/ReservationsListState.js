'use strict';

var	vxml = require('vxml'),
	ReservationsContainerFlow = require('../../common/ReservationsContainerFlow');

var ReservationsListState = vxml.State.extend({

	constructor: function (id, reservations) {
		ReservationsListState.super.call(this, id);

		this.addNestedCallFlow(new ReservationsContainerFlow(reservations));
	}
});

module.exports = ReservationsListState;
