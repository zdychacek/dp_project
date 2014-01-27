'use strict';

var vxml = require('vxml'),
	config = require('./config');

var GoodbyeState = vxml.State.extend({

	constructor: function (id) {
		GoodbyeState.super.call(this, id);
	},

	createModel: function () {
		return new vxml.Exit('Thank you for calling! Goodbye.');
	},

	onEntryAction: function* (cf, state, event) {
		// if set, save information about call
		if (config.saveCallHistory && cf.user) {
			yield cf.user.commitCallHistoryItem(cf.callHistoryItem);
		}
	}
});

module.exports = GoodbyeState;
