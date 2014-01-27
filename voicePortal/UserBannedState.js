'use strict';

var util = require('util'),
	vxml = require('vxml');

var UserBannedState = function (id) {
	vxml.State.call(this, id);

	this.bannedUntil = null;
}

util.inherits(UserBannedState, vxml.State);

UserBannedState.prototype.createModel = function (cf) {
	var bannedPrompt = new vxml.Prompt();

	bannedPrompt.audios = [
		new vxml.TtsMessage('Your account is temporarily banned. Try it again on '),
		new vxml.Var(this, 'bannedUntil', '.')
	];

	return new vxml.Exit(bannedPrompt);
};

UserBannedState.prototype.onEntryAction = function* (cf, state, event) {
	this.bannedUntil = event.data;
};

module.exports = UserBannedState;
