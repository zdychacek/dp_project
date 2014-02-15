'use strict';

var vxml = require('vxml'),
	ReservationInfoState = require('./ReservationInfoState');

var ReservationsContainerFlow = vxml.CallFlow.extend({

	constructor: function (reservations) {
		ReservationsContainerFlow.super.call(this);

		this._reservations = reservations;
	},

	getReservations: function () {
		if (this._reservations instanceof vxml.Var) {
			return this._reservations.getValue();
		}
		else {
			return this._reservations;
		}
	},

	create: function* () {
		var exitState = vxml.State.create('exit', new vxml.Say('Going back to main menu.')),
			reservations = this.getReservations();

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

		// add reservations states
		this.addStates(reservationsStates);
		// add final state
		this.addState(exitState);
	}
});

module.exports = ReservationsContainerFlow;
