'use strict';

var vxml = require('vxml');

var CancelReservationState = vxml.State.extend({
	constructor: function (id, reservation) {
		CancelReservationState.super.call(this, id);

		this.reservation = reservation;
	},

	onEntry: function* (cf, state, event) {
		try {
			console.log('Cancelling reservation...');

			yield cf.fireEvent('success');
		}
		catch (ex) {
			yield cf.fireEvent('failed');
		}
	}
});

module.exports = CancelReservationState;
