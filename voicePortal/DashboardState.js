'use strict';

var vxml = require('vxml'),
	config = require('./config');

var DashboardState = vxml.State.extend({

	constructor: function (id) {
		DashboardState.super.call(this, id);
	},

	createModel: function (cf) {
		var loggedInPrompt = new vxml.Prompt([
			new vxml.TtsMessage('Hello, "'),
			new vxml.Var(cf, '_user.firstName', ' '),
			new vxml.Var(cf, '_user.lastName', '".'),
		]);

		return new vxml.Say(loggedInPrompt)
	},

	onEntry: function* (cf, state, event) {
		// if set, save information about call
		if (config.saveCallHistory) {
			cf._callHistoryItem = yield cf._user.insertCallHistoryItem(cf.$sessionId, new Date());
		}
	}
});

module.exports = DashboardState;
