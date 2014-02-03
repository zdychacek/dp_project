'use strict';

var vxml = require('vxml'),
	CancelAllReservationsFlow = require('./flow');

var CancelAllReservationsState = vxml.State.extend({

	constructor: function (id, userVar, io) {
		CancelAllReservationsState.super.call(this, id);

		this.addNestedCallFlow(new CancelAllReservationsFlow(userVar, io));
	}
});

module.exports = CancelAllReservationsState;
