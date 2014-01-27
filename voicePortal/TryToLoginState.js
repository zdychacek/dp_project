'use strict';

var	vxml = require('vxml'),
	User = require('../models/User');

var TryToLoginState = vxml.State.extend({

	constructor: function (id) {
		TryToLoginState.super.call(this, id);
	},

	onEntryAction: function* (cf, state, event) {
		var loginResult = yield User.tryLogin(cf.loginData.login, cf.loginData.password);

		if (loginResult.user) {
			cf.user = loginResult.user;

			yield cf.fireEvent('loginOK');
		}
		else {
			var status = loginResult.status;

			console.log('User login failed with status:', status.type, status.data);
			// badLogin, disabled, banned
			yield cf.fireEvent(status.type, status.data);
		}
	}
});

module.exports = TryToLoginState;
