'use strict';

var vxml = require('vxml'),
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

			// TODO: say reservations total count

			// prepare states
			var states = reservations.map(function (reservation, i) {
				var stateId = 'reservation_' + reservation._id;

				return vxml.State.create(stateId, this._createReservationPrompt(reservation, (i == 0), (i == reservations.length - 1)));
			}, this);

			// add states transitions
			states.forEach(function (state, i) {
				var prevState = states[i - 1] || null,
					nextState = states[i + 1] || null;

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
				state.addTransition('continue', exitState, function (result) {
					return result == 4;
				});

				// add reservation state
				this.addState(state);
			}, this);

			this.addState(exitState);
		}
	},

	_createReservationPrompt: function (reservation, isFirst, isLast) {
		var promptText = ['Id is: ' + reservation._id + '. Press one to repeat' ];

		if (!isLast) {
			promptText.push('press two to continue')
		}

		if (!isFirst) {
			promptText.push('press three to go to previous reservation');
		}

		promptText.push('or press four to return to main menu.')

		promptText = promptText.join(', ');

		return new vxml.Ask({
			prompt: promptText,
			grammar: new vxml.BuiltinGrammar({ type: 'digits', length: 1 })
		});
	}
});

module.exports = ReservationsListFlow;
