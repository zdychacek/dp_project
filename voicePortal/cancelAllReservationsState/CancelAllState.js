'use strict';

var util = require('util'),
	vxml = require('../../lib/vxml');

var CancelAllState = function (id, user, io) {
	vxml.State.call(this, id);

	this._io = io;

	this.user = user;
}

util.inherits(CancelAllState, vxml.State);

CancelAllState.prototype.onEntryAction = function* (cf, state, event) {
	try {
		yield this.user.cancelAllReservations();
		this._io.sockets.emit('flight:changed');
		yield cf.fireEvent('ok');
	}
	catch (ex) {
		console.log(ex);
		yield cf.fireEvent('fail');
	}
};

module.exports = CancelAllState;
