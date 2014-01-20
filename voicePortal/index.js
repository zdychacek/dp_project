'use strict';

var util = require('util'),
	config = require('./config'),
	User = require('../models/User'),
	vxml = require('../lib/vxml'),
	helpers = require('../lib/helpers'),

	WelcomeState = require('./WelcomeState'),
	GetLoginDataState = require('./getLoginDataState'),
	TryToLoginState = require('./TryToLoginState'),
	BadLoginState = require('./BadLoginState'),
	UserDisabledState = require('./UserDisabledState'),
	UserBannedState = require('./UserBannedState'),
	DashboardState = require('./DashboardState'),
	MainMenuState = require('./MainMenuState'),
	ReservationsListState = require('./ReservationsListState'),
	CancelAllReservationsState = require('./cancelAllReservationsState'),
	MakeNewReservationState = require('./MakeNewReservationState'),
	GoodbyeState = require('./GoodbyeState');

var VoicePortalApp = function () {
	vxml.CallFlow.call(this);

	this.user = null;
	this.callHistoryItem = null;
}

util.inherits(VoicePortalApp, vxml.CallFlow);

// create app main callflow
VoicePortalApp.prototype.create = function* () {
	// say welcome message
	var welcomeState = new WelcomeState('welcome'),
		// get user login data and try to log in
		getLoginDataState = new GetLoginDataState('getLoginData'),
		// make test if user was successfully logged in or entered bad login information
		tryToLoginState = new TryToLoginState('tryToLogin'),
		// user entered bad login data
		badLoginState = new BadLoginState('badLogin'),
		// user is disabled
		userDisabledState = new UserDisabledState('userDisabled'),
		// user is banned
		userBannedState = new UserBannedState('userBanned'),
		// user was successfully logged in
		dashboardState = new DashboardState('dashboard'),
		// list users active reservations
		reservationsListState = new ReservationsListState('reservationsList'),
		// cancel users all active reservations
		cancelAllReservationsState = new CancelAllReservationsState('cancelAllReservations', new vxml.Var(this, 'user')),
		// create new reservation
		makeNewReservationState = new MakeNewReservationState('makeNewReservation'),
		// application exit point
		goodbyeState = new GoodbyeState('goodbye');

	// application main menu
	var mainMenuState = new MainMenuState('mainMenu', [
		{
			prompt: 'To cancel your all reservations',
			targetState: cancelAllReservationsState
		},
		{
			prompt: 'To list your reservations',
			targetState: reservationsListState
		},
		{
			prompt: 'To make new reservation',
			targetState: makeNewReservationState
		},
		{
			prompt: 'To exit call',
			targetState: goodbyeState
		}
	]);

	// add transitions
	welcomeState.addTransition('continue', getLoginDataState);
	getLoginDataState.addTransition('continue', tryToLoginState);
	tryToLoginState
		.addTransition('loginOK', dashboardState)
		.addTransition('badLogin', badLoginState)
		.addTransition('disabled', userDisabledState) // -> exit state
		.addTransition('banned', userBannedState); // -> exit state
	badLoginState
		.addTransition('continue', getLoginDataState, function (result) {
			return result == 1;
		})
		.addTransition('continue', goodbyeState, function (result) {
			return result == 2;
		});
	dashboardState.addTransition('continue', mainMenuState);
	reservationsListState.addTransition('continue', mainMenuState);
	cancelAllReservationsState.addTransition('continue', mainMenuState);
	makeNewReservationState.addTransition('continue', mainMenuState);

	// add states
	this
		.addState(welcomeState)
		.addState(getLoginDataState)
		.addState(tryToLoginState)
		.addState(badLoginState)
		.addState(userDisabledState)
		.addState(userBannedState)
		.addState(dashboardState)
		.addState(mainMenuState)
		.addState(reservationsListState)
		.addState(cancelAllReservationsState)
		.addState(makeNewReservationState)
		.addState(goodbyeState);
};

module.exports = VoicePortalApp;
