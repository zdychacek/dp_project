'use strict';

var util = require('util'),
	User = require('../models/User'),
	vxml = require('../lib/vxml'),
	helpers = require('../lib/helpers'),
	GetDateDtmfComponent = require('./components/GetDateDtmfComponent');

var VoicePortalApp = function () {
	vxml.CallFlow.call(this);

	this.loggedUser = null;
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
		}), 'getDate')
		.addOnExitAction(function * (cf, state, event) {
			var loginInfo = yield User.tryLogin(login, event.data),
				user = loginInfo.user,
				errors = loginInfo.errors;

			if (user) {
				cf.loggedUser = user;
				console.log(JSON.stringify(cf.loggedUser));
			}
			else {
				console.log(JSON.stringify(errors));
			}
		})
	);

	// nested cvallflow (component) test
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
		vxml.ViewStateBuilder.create('goodbye', new vxml.Exit('Goodbye.'))
	);
};

module.exports = VoicePortalApp;
