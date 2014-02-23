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
		var reservation = this._reservation,
			err = null;

		try {
			console.log('Cancelling reservation - user:', this._user._id, ', reservation:', reservation._id);

			yield reservation.cancelReservationForUser(this._user);
			// write that info to socket
			this._io && this._io.sockets.emit('flight:changed');

			yield cf.fireEvent('success');
		}
		catch (ex) {
			// NOTE: jshint problem
			err = ex;
		}

		if (err) {
			console.log(err);
			yield cf.fireEvent('failed', err);
		}
	}
});

module.exports = CancelReservationState;
