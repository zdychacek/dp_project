'use strict';

var vxml = require('vxml');

var CancelReservationState = vxml.State.extend({

	constructor: function (id, reservationVar, user, io) {
		CancelReservationState.super.call(this, id);

		this._reservationVar = reservationVar;
		this._user = user;
		this._io = io;
	},

	onEntry: function* (cf, state, event) {
		var reservation = this._reservationVar.getValue();

		try {
			console.log('Cancelling reservation - user:', this._user._id, ', reservation:', reservation._id);

			yield reservation.cancelReservationForUser(this._user);
			// write that info to socket
			this._io && this._io.sockets.emit('flight:changed');

			yield cf.fireEvent('success');
		}
		catch (ex) {
			console.log(ex);
			yield cf.fireEvent('failed', ex);
		}
	}
});

module.exports = CancelReservationState;
