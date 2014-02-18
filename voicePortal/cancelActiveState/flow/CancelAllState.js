'use strict';

var vxml = require('vxml');

var CancelAllState = vxml.State.extend({

	constructor: function (id, user, io) {
		CancelAllState.super.call(this, id);

		this._io = io;

		this._user = user;
	},

	onEntry: function* (cf, state, event) {
		try {
			yield this._user.cancelAllReservations();
			this._io.sockets.emit('flight:changed');
			yield cf.fireEvent('ok');
		}
		catch (ex) {
			console.log(ex);
			yield cf.fireEvent('fail');
		}
	}
});

module.exports = CancelAllState;
