'use strict';

var util = require('util'),
	User = require('../models/User'),
	vxml = require('../lib/vxml'),
	helpers = require('../lib/helpers'),
	GetDateDtmfComponent = require('./components/GetDateDtmfComponent');

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

	this.user = null;
	this.callHistoryItem = null;
}

util.inherits(VoicePortalApp, vxml.CallFlow);

// create app main callflow
VoicePortalApp.prototype.create = function *() {
	var login = null;

	// 1. get user login
	this.addState(
		vxml.ViewStateBuilder.create('getLogin', new vxml.Ask({
			prompt: 'Enter your login.',
			grammar: new vxml.BuiltinGrammar({
				type: 'digits',
				length: 6
			})
		}), 'getPassword')
		.addOnExitAction(function * (cf, state, event) {
			login = event.data;
		})
	);

	// 2. get user password
	this.addState(
		vxml.ViewStateBuilder.create('getPassword', new vxml.Ask({
			prompt: 'Enter your password.',
			grammar: new vxml.BuiltinGrammar({
				type: 'digits',
				length: 6
			})
		}), 'testState')
		.addOnExitAction(function* (cf, state, event) {
			var loginInfo = yield User.tryLogin(login, event.data),
				user = loginInfo.user,
				errors = loginInfo.errors;

			if (user) {
				cf.user = user;
				cf.callHistoryItem = yield user.insertCallHistoryItem(cf.$sessionId, new Date());

				console.log(JSON.stringify(cf.user));
			}
			else {
				console.log(JSON.stringify(errors));
			}
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
