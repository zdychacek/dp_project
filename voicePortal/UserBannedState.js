'use strict';

var	vxml = require('vxml');

var UserBannedState = vxml.State.extend({

	constructor: function (id) {
		UserBannedState.super.call(this, id);

		this._bannedUntil = null;
	},

	createModel: function (cf) {
		var bannedPrompt = new vxml.Prompt([
			new vxml.TtsMessage('Your account is temporarily banned. Try it again on '),
			// TODO: say-as
			new vxml.Var(this, '_bannedUntil', '.')
		]);

		return new vxml.Exit(bannedPrompt);
	},

	onEntry: function* (cf, state, event) {
		this._bannedUntil = event.data;
	}
});

module.exports = UserBannedState;
