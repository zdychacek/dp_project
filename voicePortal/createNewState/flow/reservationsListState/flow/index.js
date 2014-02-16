'use strict';

var vxml = require('vxml'),
	ReservationsContainerFlow = require('../../../../common/reservationsContainerFlow');

var ListResultsFlow = vxml.CallFlow.extend({

	constructor: function (reservationsVar, userVar, io) {
		ListResultsFlow.super.call(this);

		this.reservationsVar = reservationsVar;
		this.userVar = userVar;
		this._io = io;
	},

	create: function* () {
		var reservations = this.reservationsVar.getValue(),
			user = this.userVar.getValue();

		// there's no existing reservations
		if (!reservations.length) {
			var noReservationsState = vxml.State.create('noReservations', new vxml.Say('No reservations matching specified criterias were found.'));

			this.addState(noReservationsState);
		}
		else {
			var reservationCountState = vxml.State.create('reservationsCount',
				new vxml.Say('We found ' + reservations.length + ' reservations. List follows.')
			);
			var reservationsState = new vxml.State('reservations');
			reservationsState.addNestedCallFlow(new ReservationsContainerFlow(reservations, user, this._io, {
				canCancelReservation: true,
				canMakeReservation: true
			}));

			reservationCountState.addTransition('continue', reservationsState);

			// add reservations count info state
			this.addState(reservationCountState);
			// add reservations list state
			this.addState(reservationsState);
		}
	}
});

module.exports = ListResultsFlow;
