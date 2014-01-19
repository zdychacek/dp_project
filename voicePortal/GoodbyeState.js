'use strict';

var util = require('util'),
	vxml = require('../lib/vxml'),
	config = require('./config');

var GoodbyeState = function (id) {
	vxml.State.call(this, id);

	this.setModel(
		new vxml.Exit('Thank you for calling! Goodbye.')
	);
	this.addOnEntryAction(this.onEntryAction);
}

util.inherits(GoodbyeState, vxml.State);

GoodbyeState.prototype.onEntryAction = function* (cf, state, event) {
	// if set, save information about call
	if (config.saveCallHistory && cf.user) {
		yield cf.user.commitCallHistoryItem(cf.callHistoryItem);
	}
};

module.exports = GoodbyeState;
