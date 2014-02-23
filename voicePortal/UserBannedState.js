'use strict';

var	vxml = require('vxml'),
	utils = require('./common/utils');

var UserBannedState = vxml.State.extend({

	constructor: function (id) {
		UserBannedState.super.call(this, id);

		this._bannedUntil = null;
	},

	createModel: function (cf) {
		var bannedPrompt = new vxml.Prompt([
			new vxml.TtsMessage('Your account is temporarily banned. Try it again on '),
			new vxml.Var(this, '_bannedUntil.day'),
			new vxml.Var(this, '_bannedUntil.month'),
			new vxml.Var(this, '_bannedUntil.year'),
			new vxml.TtsMessage(' at '),
			new vxml.Var(this, '_bannedUntil.hours'),
			new vxml.TtsMessage(' and '),
			new vxml.Var(this, '_bannedUntil.minutes'),
			new vxml.TtsMessage(' minutes.'),
			new vxml.Silence('weak')
		]);

		return new vxml.Exit(bannedPrompt);
	},

	onEntry: function* (cf, state, event) {
		this._bannedUntil = utils.convertDate(event.data);
	}
});

module.exports = UserBannedState;
