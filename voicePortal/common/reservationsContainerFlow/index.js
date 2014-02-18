'use strict';

var vxml = require('vxml'),
	ReservationInfoState = require('./ReservationInfoState'),
	ReservationMenuState = require('./reservationMenuState');

var ReservationsContainerFlow = vxml.CallFlow.extend({

	constructor: function (reservations, user, io, options /* returnMessage, canCancelReservation, canMakeReservation */) {
		options || (options = {});

		ReservationsContainerFlow.super.call(this);

		this._reservations = reservations;
		this._user = user;
		this._io = io;
		this._returnMessage = options.returnMessage || 'Going back to main menu.';
		this._canCancelReservation = options.canCancelReservation || false;
		this._canMakeReservation = options.canMakeReservation || false;
		this._currReservation = null;
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
		var reservations = this.getReservations(),
			exitState = vxml.State.create('exit', new vxml.Say(this._returnMessage)),
			reservationMenuState = new ReservationMenuState(new vxml.Var(this, '_currReservation'), this._user, this._io, {
				canMake: this._canMakeReservation,
				canCancel: this._canCancelReservation
			});

		// prepare reservationsStates
		var reservationsStates = [],
			hasMenu = this._canMakeReservation || this._canCancelReservation;

		reservations.forEach(function (reservation, i) {
			reservationsStates.push(new ReservationInfoState(reservation, (i == 0), (i == reservations.length - 1), hasMenu));
		}, this);

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

			if (hasMenu) {
				state.addOnEntryAction(function* (cf, state, event) {
					cf._currReservation = state;

					reservationMenuState.setExitTransition(state);
				});

				state.addTransition('continue', reservationMenuState, function (result) { return result == 5; });
			}
		}, this);

		// add reservations states
		this.addStates(reservationsStates);
		// add reservations edit menu
		this.addState(reservationMenuState);
		// add final state
		this.addState(exitState);
	}
});

module.exports = ReservationsContainerFlow;
