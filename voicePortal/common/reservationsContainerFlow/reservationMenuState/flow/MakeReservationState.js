'use strict';

var vxml = require('vxml');

var MakeReservationState = vxml.State.extend({
	constructor: function (id, reservation) {
		MakeReservationState.super.call(this, id);

		this.reservation = reservation;
	},

	onEntry: function* (cf, state, event) {
		try {
			console.log('Making reservation...');

			yield cf.fireEvent('success');
		}
		catch (ex) {
			yield cf.fireEvent('failed');
		}
	}
});

module.exports = MakeReservationState;
