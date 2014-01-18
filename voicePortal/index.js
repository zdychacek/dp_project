'use strict';

var util = require('util'),
	User = require('../models/User'),
	vxml = require('../lib/vxml'),
	helpers = require('../lib/helpers'),

	GetDateDtmfComponent = require('./components/GetDateDtmfComponent'),
	WelcomeFlow = require('./welcomeFlow'),
	LoginFlow = require('./loginFlow');

var SAVE_CALL_HISTORY = false;

/*
	Application main outline:
	1. Login state
	2. Dashboard (reservations info)
	3. Reservation list
	4. Cancel all reservations
	5. Create new reservation
	6. Goodbye
*/
var VoicePortalApp = function () {
	vxml.CallFlow.call(this);

	this._user = null;
	this._callHistoryItem = null;
}

util.inherits(VoicePortalApp, vxml.CallFlow);

// create app main callflow
VoicePortalApp.prototype.create = function* () {
	var loginResult = null;

	// say welcome message
	this.addState(
		new vxml.State('welcome', 'login')
			.addNestedCallFlow(new WelcomeFlow())
	);

	// get user login data and try to log in
	this.addState(
		new vxml.State('login', 'testIfLoggedIn')
			.addNestedCallFlow(new LoginFlow())
			.addOnExitAction(function* (cf, state, event) {
				loginResult = yield state.nestedCF.getLoginResult();
			})
	);

	// make test if user was successfully logged in or entered bad login information
	this.addState(
		new vxml.State('testIfLoggedIn', 'getDate')
			.addTransition('badLogin', 'loginFailed')
			.addTransition('loggedIn', 'loggedIn')
			.addOnEntryAction(function* (cf, state, event) {
				if (loginResult.errors) {
					yield cf.fireEvent('badLogin', loginResult.errors);
				}
				else {
					yield cf.fireEvent('loggedIn', loginResult.user);
				}
			})
	);

	// user was successfully logged in
	this.addState(
		vxml.ViewStateBuilder.create('loggedIn', new vxml.Say('You are logged in!'), 'getDate')
			.addOnEntryAction(function* (cf, state, event) {
				cf._user = event.data;

				// if set, save information about call
				if (SAVE_CALL_HISTORY) {
					cf._callHistoryItem = yield cf._user.insertCallHistoryItem(cf.$sessionId, new Date());
				}

				console.log('user:', event.data);
			})
	);

	// user entered bad login data
	this.addState(
		vxml.ViewStateBuilder.create('loginFailed', new vxml.Say('Bad login!'), 'getDate')
			.addOnEntryAction(function* (cf, state, event) {
				console.log('errors:', event.data);
			})
	);

	// nested callflow (component) test
	this.addState(
		new vxml.State('getDate', 'goodbye')
			.addNestedCallFlow(
				new GetDateDtmfComponent('Enter the date as a eight digit number.')
			)
			.addOnExitAction(function* (cf, state, event) {
				cf.startDate = state.nestedCF.getDate();
			})
	);

	// application exit point
	this.addState(
		vxml.ViewStateBuilder.create('goodbye', new vxml.Exit('Thank you for calling! Goodbye.'))
			.addOnEntryAction(function* (cf, state, event) {
				// if set, save information about call
				if (SAVE_CALL_HISTORY && cf._user) {
					yield cf._user.commitCallHistoryItem(cf._callHistoryItem);
				}
			})
	);
};

module.exports = VoicePortalApp;
