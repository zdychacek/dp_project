'use strict';

var util = require('util'),
	User = require('../models/User'),
	vxml = require('../lib/vxml');

var VoicePortalApp = function () {
	vxml.CallFlow.call(this);

	this.loggedUser = null;
}

// oddedeni
util.inherits(VoicePortalApp, vxml.CallFlow);

// vytvoreni callflow
VoicePortalApp.prototype.create = function *() {
	var login = null;

	// 1. ziskam login
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

	// 2. ziskam heslo
	this.addState(
		vxml.ViewStateBuilder.create('getPassword', new vxml.Ask({
			prompt: 'Enter your password.',
			grammar: new vxml.BuiltinGrammar({
				type: 'digits',
				length: 6
			})
		}))
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
}

module.exports = VoicePortalApp;
