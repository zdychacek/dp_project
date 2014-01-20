'use strict';

var util = require('util'),
	vxml = require('../lib/vxml'),
	User = require('../models/User');

var TryToLoginState = function (id) {
	vxml.State.call(this, id);
}

util.inherits(TryToLoginState, vxml.State);

TryToLoginState.prototype.onEntryAction = function* (cf, state, event) {
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
};

module.exports = TryToLoginState;
