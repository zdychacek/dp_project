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
			new vxml.Var(cf, 'user.firstName', ' '),
			new vxml.Var(cf, 'user.lastName', '".'),
		]);

		// TODO: add information about reservations total count
		return new vxml.Say(loggedInPrompt)
	},

	onEntry: function* (cf, state, event) {
		// if set, save information about call
		if (config.saveCallHistory) {
			cf.callHistoryItem = yield cf.user.insertCallHistoryItem(cf.$sessionId, new Date());
		}
	}
});

module.exports = DashboardState;
