'use strict';

var util = require('util'),
	config = require('./config'),
	User = require('../models/User'),
	vxml = require('../lib/vxml'),
	helpers = require('../lib/helpers'),

	AskWithNoInputPrompt = require('./components/AskWithNoInputPrompt'),
	GetDateDtmfComponent = require('./components/GetDateDtmfComponent'),
	WelcomeFlow = require('./welcomeFlow'),
	GetLoginDataFlow = require('./getLoginDataFlow');

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
VoicePortalApp.prototype.create = function* () {
	// say welcome message
	this.addState(
		new vxml.State('welcome', 'getLoginData')
			.addNestedCallFlow(new WelcomeFlow())
	);

	// get user login data and try to log in
	this.addState(
		new vxml.State('getLoginData', 'tryToLogin')
			.addNestedCallFlow(new GetLoginDataFlow())
			.addOnExitAction(function* (cf, state, event) {
				cf.loginData = state.nestedCF.getUserLoginData();
			})
	);

	// make test if user was successfully logged in or entered bad login information
	this.addState(
		new vxml.State('tryToLogin')
			.addTransition('loginFailed', 'badLogin')
			.addTransition('loginOK', 'loggedIn')
			.addOnEntryAction(function* (cf, state, event) {
				var loginResult = yield User.tryLogin(cf.loginData.login, cf.loginData.password);

				if (loginResult.user) {
					cf.user = loginResult.user;
					yield cf.fireEvent('loginOK');
				}
				else {
					yield cf.fireEvent('loginFailed', loginResult.errors);
				}
			})
	);

	// user entered bad login data
	this.addState(this._createBadLoginState());

	// user was successfully logged in
	this.addState(this._createLoggedInState());

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
		vxml.State.create('goodbye', new vxml.Exit('Thank you for calling! Goodbye.'))
			.addOnEntryAction(function* (cf, state, event) {
				// if set, save information about call
				if (config.saveCallHistory && cf.user) {
					yield cf.user.commitCallHistoryItem(cf.callHistoryItem);
				}
			})
	);
};

VoicePortalApp.prototype._createBadLoginState = function () {
	var badLoginPrompt = new vxml.Prompt();

	badLoginPrompt.audios = [
		new vxml.TtsMessage('You\'ve entered bad login information.'),
		new vxml.Silence('weak'),
		new vxml.TtsMessage('Press one if you would like to try it again, otherwise press two.')
	];

	return vxml.State.create('badLogin', new AskWithNoInputPrompt({
		prompt: badLoginPrompt,
		grammar: new vxml.BuiltinGrammar({ type: 'digits', length: 1 })
	}))
		.addTransition('continue', 'getLoginData', function (result) {
			return result == 1;
		})
		.addTransition('continue', 'goodbye', function (result) {
			return result == 2;
		})
		.addOnEntryAction(function* (cf, state, event) {
			console.log('errors:', event.data);
		});
};

VoicePortalApp.prototype._createLoggedInState = function () {
	var loggedInPrompt = new vxml.Prompt();

	loggedInPrompt.audios = [
		new vxml.TtsMessage('You are logged in "'),
		new vxml.Var(this, 'user.firstName', ' '),
		new vxml.Var(this, 'user.lastName', '".'),
	];

	return vxml.State.create('loggedIn', new vxml.Say(loggedInPrompt), 'getDate')
		.addOnEntryAction(function* (cf, state, event) {
			// if set, save information about call
			if (config.saveCallHistory) {
				cf.callHistoryItem = yield cf.user.insertCallHistoryItem(cf.$sessionId, new Date());
			}

			console.log('user:', cf.user);
		});
};


module.exports = VoicePortalApp;
