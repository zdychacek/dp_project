'use strict';

var vxml = require('vxml'),
	ReservationInfoState = require('../common/ReservationInfoState'),
	User = require('../../models/User');

var ReservationsListFlow = vxml.CallFlow.extend({

	constructor: function (userVar) {
		ReservationsListFlow.super.call(this);

		this.userVar = userVar;
	},

	create: function* () {
		var user = this.userVar.getValue(),
			reservations = yield user.listReservations();

		// there's no existing reservations
		if (!reservations.length) {
			var noReservationsState = vxml.State.create('noReservations', new vxml.Say('There are no active reservations.'));

			this.addState(noReservationsState);
		}
		else {
			var exitState = vxml.State.create('exit', new vxml.Say('Going back to main menu.'));

			// prepare reservationsStates
			var reservationsStates = reservations.map(function (reservation, i) {
				return new ReservationInfoState(reservation, (i == 0), (i == reservations.length - 1));
			});

			// add reservationsStates transitions
			reservationsStates.forEach(function (state, i) {
				var prevState = reservationsStates[i - 1] || null,
					nextState = reservationsStates[i + 1] || null;

				// Repeat info
				state.addTransition('continue', state, function (result) { return result == 1; });

				// Go to next reservation
				if (nextState) {
					state.addTransition('continue', nextState, function (result) { return result == 2; });
				}

				// Go to previous reservation
				if (prevState) {
					state.addTransition('continue', prevState, function (result) { return result == 3; });
				}
				// Exit to main menu
				state.addTransition('continue', exitState, function (result) { return result == 4; });
			}, this);

			var reservationCountState = vxml.State.create('reservationsCount',
				new vxml.Say('You have ' + reservations.length + ' active reservations. List follows.')
			);
			reservationCountState.addTransition('continue', reservationsStates[0]);

			// add reservations count info state
			this.addState(reservationCountState);
			// add reservations states
			this.addStates(reservationsStates);
			// add final state
			this.addState(exitState);
		}
	}
});

module.exports = ReservationsListFlow;
