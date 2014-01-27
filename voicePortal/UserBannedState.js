'use strict';

var	vxml = require('vxml');

var UserBannedState = vxml.State.extend({

	constructor: function (id) {
		UserBannedState.super.call(this, id);

		this.bannedUntil = null;
	},

	createModel: function (cf) {
		var bannedPrompt = new vxml.Prompt();

		bannedPrompt.audios = [
			new vxml.TtsMessage('Your account is temporarily banned. Try it again on '),
			new vxml.Var(this, 'bannedUntil', '.')
		];

		return new vxml.Exit(bannedPrompt);
	},

	onEntryAction: function* (cf, state, event) {
		this.bannedUntil = event.data;
	}
});

module.exports = UserBannedState;
