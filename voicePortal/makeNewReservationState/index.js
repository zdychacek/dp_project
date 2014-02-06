'use strict';

var vxml = require('vxml'),
	MakeNewReservationFlow = require('./flow');

var MakeNewReservationState = vxml.State.extend({

	constructor: function (id, userVar) {
		MakeNewReservationState.super.call(this, id);

		this.addNestedCallFlow(new MakeNewReservationFlow(userVar));
	}
});

module.exports = MakeNewReservationState;
