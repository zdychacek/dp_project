'use strict';

var	vxml = require('vxml'),
	ListResultsFlow = require('./flow');

var ReservationsListState = vxml.State.extend({

	constructor: function (id, reservationsVar, userVar, io) {
		ReservationsListState.super.call(this, id);

		this.addNestedCallFlow(new ListResultsFlow(reservationsVar, userVar, io));
	}
});

module.exports = ReservationsListState;
