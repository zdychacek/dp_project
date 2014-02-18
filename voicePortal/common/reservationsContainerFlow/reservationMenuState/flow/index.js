'use strict';

var vxml = require('vxml'),
	MenuState = require('../../../../common/MenuState'),
	MakeReservationState = require('./MakeReservationState'),
	CancelReservationState = require('./CancelReservationState');

var ReservationMenuFlow = vxml.CallFlow.extend({
	
	constructor: function (reservationVar, user, io, options) {
		options || (options = {});

		ReservationMenuFlow.super.call(this);

		this._reservationVar = reservationVar;
		this._user = user;
		this._io = io;
		this._canCancel = options.canCancel || false;
		this._canMake = options.canMake || false;
	},

	create: function* () {
		var reservation = this._reservationVar.getValue(),
			makeReservationState = new MakeReservationState('makeReservation', this._reservationVar, this._user, this._io),
			cancelReservationState = new CancelReservationState('cancelReservation', this._reservationVar, this._user, this._io),
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
			makeReservationErrorState = vxml.State.create('makeReservationError', new vxml.Say('Error while saving. Maybe your reservation already exists.')),
			cancelReservationErrorState = vxml.State.create('cancelReservationError', new vxml.Say('Error while saving. Maybe your reservation was already cancelled.'));

		makeReservationState
			.addTransition('success', okState)
			.addTransition('failed', makeReservationErrorState);

		cancelReservationState
			.addTransition('success', okState)
			.addTransition('failed', cancelReservationErrorState);

		this
			.addState(menuState)
			.addState(makeReservationState)
			.addState(cancelReservationState)
			.addState(okState)
			.addState(makeReservationErrorState)
			.addState(cancelReservationErrorState);
	}
});

module.exports = ReservationMenuFlow;
