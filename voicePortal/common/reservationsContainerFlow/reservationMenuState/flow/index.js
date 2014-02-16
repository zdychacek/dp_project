'use strict';

var vxml = require('vxml'),
	MenuState = require('../../../../common/MenuState'),
	MakeReservationState = require('./MakeReservationState'),
	CancelReservationState = require('./CancelReservationState');

var ReservationMenuFlow = vxml.CallFlow.extend({
	constructor: function (reservation, options) {
		options || (options = {});

		ReservationMenuFlow.super.call(this);

		this._reservation = reservation;
		this._canCancel = options.canCancel || false;
		this._canMake = options.canMake || false;
	},

	create: function* () {
		var makeReservationState = new MakeReservationState('makeReservation', this._reservation),
			cancelReservationState = new CancelReservationState('cancelReservation', this._reservation),
			menuItems = [];

		if (this._canMake) {
			menuItems.push({
				prompt: 'To make reservation',
				targetState: makeReservationState
			});
		}

		if (this._canCancel) {
			menuItems.push({
				prompt: 'To cancel reservation',
				targetState: cancelReservationState
			});
		}

		var menuState = new MenuState('editMenu', menuItems),
			okState = vxml.State.create('ok', new vxml.Say('Succesfully saved.')),
			errorState = vxml.State.create('error', new vxml.Say('Error while saving. Please try it again.'))

		makeReservationState
			.addTransition('success', okState)
			.addTransition('failed', errorState);

		cancelReservationState
			.addTransition('success', okState)
			.addTransition('failed', errorState);

		this
			.addState(menuState)
			.addState(makeReservationState)
			.addState(cancelReservationState)
			.addState(okState)
			.addState(errorState);
	}
});

module.exports = ReservationMenuFlow;
