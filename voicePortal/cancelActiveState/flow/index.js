'use strict';

var vxml = require('vxml'),
	User = require('../../../models/User'),
	AskState = require('./AskState'),
	CancelAllState = require('./CancelAllState');

var CancelActiveFlow = vxml.CallFlow.extend({

	constructor: function (userVar, io) {
		CancelActiveFlow.super.call(this);

		this._io = io;

		this.userVar = userVar;
	},

	create: function* () {
		var user = this.userVar.getValue(),
			reservations = yield user.listReservations();

		if (!reservations.length) {
			var noReservationsState = vxml.State.create('noReservations', new vxml.Say('There are no active reservations.'));

			this.addState(noReservationsState);
		}
		else {
			var askState = new AskState('ask', reservations),
				cancelAllState = new CancelAllState('cancelAll', user, this._io),
				cancelOkState = vxml.State.create('cancelOk', new vxml.Say('Your reservations were canceled.')),
				cancelErrorState = vxml.State.create('cancelError', new vxml.Say('There was an error while cancelling reservations Please try it again.')),
				finalState = vxml.State.create('finalState', new vxml.Say('No reservations were deleted. Going back to the main menu.'));

			askState
				.addTransition('continue', cancelAllState, function (result) {
					return result == 1;
				})
				.addTransition('continue', finalState, function (result) {
					return result == 2;
				});
			cancelAllState
				.addTransition('fail', cancelErrorState)
				.addTransition('ok', cancelOkState);

			// add states
			this.addState(askState)
				.addState(cancelAllState)
				.addState(cancelOkState)
				.addState(cancelErrorState)
				.addState(finalState);
		}
	}
});

module.exports = CancelActiveFlow;
