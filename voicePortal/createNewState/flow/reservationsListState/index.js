'use strict';

var	vxml = require('vxml'),
	ListResultsFlow = require('./flow');

var ReservationsListState = vxml.State.extend({

	constructor: function (id, reservationsVar) {
		ReservationsListState.super.call(this, id);

		this.addNestedCallFlow(new ListResultsFlow(reservationsVar));
	}
});

module.exports = ReservationsListState;
