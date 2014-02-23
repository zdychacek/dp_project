'use strict';

var vxml = require('vxml'),
	MenuState = require('../../../../common/MenuState'),
	DepartureInfoState = require('./DepartureInfoState'),
	ArrivalInfoState = require('./ArrivalInfoState'),
	PriceInfoState = require('./PriceInfoState'),
	FlightCapacityInfoState = require('./FlightCapacityInfoState'),
	OtherInfoState = require('./OtherInfoState'),
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
			makeReservationState = new MakeReservationState('makeReservation', reservation, this._user, this._io),
			cancelReservationState = new CancelReservationState('cancelReservation', reservation, this._user, this._io),
			departureInfoState = new DepartureInfoState('departureInfo', reservation),
			arrivalInfoState = new ArrivalInfoState('arrivalInfo', reservation),
			priceInfoState = new PriceInfoState('priceInfo', reservation),
			flightCapacityInfoState = new FlightCapacityInfoState('flightCapacityInfo', reservation),
			otherInfoState = new OtherInfoState('otherInfo', reservation),
			goBackState = vxml.State.create('goBack', new vxml.Say('Returning to list.'));

		var menuItems = [
			{
				prompt: 'To get information about departure',
				targetState: departureInfoState
			},
			{
				prompt: 'To get information about arrival',
				targetState: arrivalInfoState
			},
			{
				prompt: 'To get information about price',
				targetState: priceInfoState
			},
			{
				prompt: 'To get information about flight capacity',
				targetState: flightCapacityInfoState
			},
			{
				prompt: 'To get information about total flight duration and transfers count',
				targetState: otherInfoState
			}
		];

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

		menuItems.push({
			prompt: 'To return to list',
			targetState: goBackState
		});

		var menuState = new MenuState('menu', menuItems),
			okState = vxml.State.create('ok', new vxml.Say('Succesfully saved.')),
			makeReservationErrorState = vxml.State.create('makeReservationError', new vxml.Say('Error while saving. Maybe your reservation already exists.')),
			cancelReservationErrorState = vxml.State.create('cancelReservationError', new vxml.Say('Error while saving. Maybe your reservation was already cancelled.'));

		makeReservationState
			.addTransition('success', okState)
			.addTransition('failed', makeReservationErrorState);

		cancelReservationState
			.addTransition('success', okState)
			.addTransition('failed', cancelReservationErrorState);

		okState.addTransition('continue', menuState);
		makeReservationErrorState.addTransition('continue', menuState);
		cancelReservationErrorState.addTransition('continue', menuState);

		departureInfoState.addTransition('continue', menuState);
		arrivalInfoState.addTransition('continue', menuState);
		priceInfoState.addTransition('continue', menuState);
		flightCapacityInfoState.addTransition('continue', menuState);
		otherInfoState.addTransition('continue', menuState);

		this
			.addState(menuState)
			.addState(makeReservationState)
			.addState(cancelReservationState)
			.addState(okState)
			.addState(makeReservationErrorState)
			.addState(cancelReservationErrorState)
			.addState(departureInfoState)
			.addState(arrivalInfoState)
			.addState(priceInfoState)
			.addState(flightCapacityInfoState)
			.addState(otherInfoState)
			.addState(goBackState);
	}
});

module.exports = ReservationMenuFlow;
