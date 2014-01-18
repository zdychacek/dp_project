'use strict';

var util = require('util'),
	User = require('../models/User'),
	vxml = require('../lib/vxml'),
	helpers = require('../lib/helpers'),

	WelcomeFlow = require('./welcomeFlow'),
	LoginFlow = require('./loginFlow');

var SAVE_HISTORY = false;

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
	this.addState(new vxml.State('welcome', 'login').addNestedCallFlow(new WelcomeFlow()));

	this.addState(
		new vxml.State('login', 'testState')
			.addNestedCallFlow(new LoginFlow())
			.addOnEntryAction(function* (cf, state, event) {
				console.log('login ENTRY');
			})
			.addOnExitAction(function* (cf, state, event) {
				var result = yield state.nestedCF.getLoginResult();

				console.log('result:', result);
			})
	);

	this.addState(
		vxml.ViewStateBuilder.create('testState', new vxml.Say('Hi there!'), 'goodbye')
	);

	// nested cvallflow (component) test
	/*this.addState(
		new vxml.State('getDate', 'goodbye')
			.addNestedCallFlow(
				new GetDateDtmfComponent('Enter the date as a eight digit number.')
			)
			.addOnExitAction(function* (cf, state, event) {
				cf.startDate = state.nestedCF.getDate();
			})
	);*/

	// application exit point
	this.addState(
		vxml.ViewStateBuilder.create('goodbye', new vxml.Exit('Thank you for calling! Goodbye.'))
			.addOnEntryAction(function* (cf, state, event) {
				if (SAVE_HISTORY && cf._isUserLogged()) {
					yield cf.user.commitCallHistoryItem(cf.callHistoryItem);
				}
			})
	);
};

VoicePortalApp.prototype._isUserLogged = function () {
	return !!this.user;
};

module.exports = VoicePortalApp;
