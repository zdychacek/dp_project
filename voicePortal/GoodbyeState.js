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

	onEntry: function* (cf, state, event) {
		// if set, save information about call
		if (config.saveCallHistory && cf._user) {
			yield cf._user.commitCallHistoryItem(cf._callHistoryItem);
		}
	}
});

module.exports = GoodbyeState;
