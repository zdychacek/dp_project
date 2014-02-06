'use strict';

var vxml = require('vxml'),
	GetReservationIdState = require('./GetReservationIdState');

var FilterByIdFlow = vxml.CallFlow.extend({

	constructor: function () {
		FilterByIdFlow.super.call(this);
	},

	create: function* () {
		var getReservationIdState = new GetReservationIdState('getReservationId');

		this.addState(getReservationIdState);
	}
});

module.exports = FilterByIdFlow;
