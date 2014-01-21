'use strict';

var util = require('util'),
	vxml = require('../../lib/vxml');

var CancelAllState = function (id, user) {
	vxml.State.call(this, id);

	this.user = user;
}

util.inherits(CancelAllState, vxml.State);

CancelAllState.prototype.onEntryAction = function* (cf, state, event) {
	try {
		yield this.user.cancelAllReservations();
		yield cf.fireEvent('ok');
	}
	catch (ex) {
		yield cf.fireEvent('fail');
	}
};

module.exports = CancelAllState;
