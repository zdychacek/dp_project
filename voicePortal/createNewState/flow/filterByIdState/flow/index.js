'use strict';

var vxml = require('vxml'),
	GetReservationIdState = require('./GetReservationIdState');

var FilterByIdFlow = vxml.CallFlow.extend({

	constructor: function () {
		FilterByIdFlow.super.call(this);

		this._id = null;
	},

	create: function* () {
		var getReservationIdState = new GetReservationIdState('getReservationId');

		this.addState(getReservationIdState);
	},

	getId: function () {
		return this._id;
	}
});

module.exports = FilterByIdFlow;
