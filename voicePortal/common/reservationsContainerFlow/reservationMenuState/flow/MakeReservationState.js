'use strict';

var vxml = require('vxml');

var MakeReservationState = vxml.State.extend({

	constructor: function (id, reservationVar, user, io) {
		MakeReservationState.super.call(this, id);

		this._reservationVar = reservationVar;
		this._user = user;
		this._io = io;
	},

	onEntry: function* (cf, state, event) {
		var reservation = this._reservationVar.getValue();

		try {
			console.log('Making reservation - user:', this._user._id, ', reservation:', reservation._id);

			yield reservation.addReservationForUser(this._user);
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

module.exports = MakeReservationState;
