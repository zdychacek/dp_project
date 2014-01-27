'use strict';

var vxml = require('vxml');

var MakeNewReservationState = vxml.State.extend({

	constructor: function (id) {
		MakeNewReservationState.super.call(this, id);
	},

	createModel: function () {
		return new vxml.Say('MakeNewReservationState menu');
	}
});

module.exports = MakeNewReservationState;
