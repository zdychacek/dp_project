'use strict';

var util = require('util'),
	User = require('../../models/User'),
	vxml = require('../../lib/vxml');

var VoicePortalApp = function () {
	vxml.CallFlow.call(this);

	this.loggedUser = null;
}

// oddedeni
util.inherits(VoicePortalApp, vxml.CallFlow);

// vytvoreni callflow
VoicePortalApp.prototype.create = function *() {
	var login = null,
		password = null;

	// 1. ziskam login
	this.addState(
		vxml.ViewStateBuilder.create('getLogin', new vxml.Ask({
			prompt: 'Enter your login.',
			grammar: new vxml.BuiltinGrammar({
				type: 'digits',
				length: 6
			})
		}), 'getPassword')
		// TODO: nastavovat event type
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
			var password = event.data,
				result = yield User.tryLogin(login, '12345');

			cf.loggedUser = result.user || null;
			console.log(JSON.stringify(cf.loggedUser));
		})
	);
}

module.exports = VoicePortalApp;
