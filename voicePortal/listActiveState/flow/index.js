'use strict';

var vxml = require('vxml'),
	ReservationsContainerFlow = require('../../common/reservationsContainerFlow');

var ListActiveFlow = vxml.CallFlow.extend({

	constructor: function (userVar, io) {
		ListActiveFlow.super.call(this);

		this._userVar = userVar;
		this._io = io;
	},

	create: function* () {
		var user = this._userVar.getValue(),
			reservations = yield user.listReservations();

		// there's no existing reservations
		if (!reservations.length) {
			var noReservationsState = vxml.State.create('noReservations', new vxml.Say('There are no active reservations.'));

			this.addState(noReservationsState);
		}
		else {
			var reservationCountState = vxml.State.create('reservationsCount',
				new vxml.Say('You have ' + reservations.length + ' active reservations. List follows.')
			);
			var reservationsState = new vxml.State('reservations');
			reservationsState.addNestedCallFlow(new ReservationsContainerFlow(reservations, user, this._io, {
				canCancelReservation: true
			}));

			reservationCountState.addTransition('continue', reservationsState);

			// add reservations count info state
			this.addState(reservationCountState);
			// add reservations list state
			this.addState(reservationsState);
		}
	}
});

module.exports = ListActiveFlow;
