'use strict';

var vxml = require('vxml'),
	ReservationsListFlow = require('./flow');

var ReservationsListState = vxml.State.extend({

	constructor: function (id, userVar) {
		ReservationsListState.super.call(this, id);

		this.addNestedCallFlow(new ReservationsListFlow(userVar));
	}
});

module.exports = ReservationsListState;
