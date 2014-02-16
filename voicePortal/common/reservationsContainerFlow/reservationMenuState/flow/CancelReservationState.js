'use strict';

var vxml = require('vxml');

var CancelReservationState = vxml.State.extend({

	constructor: function (id, reservation, user, io) {
		CancelReservationState.super.call(this, id);

		this._reservation = reservation;
		this._user = user;
		this._io = io;
	},

	onEntry: function* (cf, state, event) {
		try {
			console.log('Cancelling reservation - user:', this._user._id, ', reservation:', this._reservation._id, 'io: ', !!this._io);

			yield this._reservation.cancelReservationForUser(this._user);
			// write that info to socket
			this._io.sockets.emit('flight:changed');

			yield cf.fireEvent('success');
		}
		catch (ex) {
			console.log(ex);
			yield cf.fireEvent('failed', ex);
		}
	}
});

module.exports = CancelReservationState;
