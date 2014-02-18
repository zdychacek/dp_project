'use strict';

var	vxml = require('vxml');

var ReservationsListState = vxml.State.extend({

	constructor: function (id) {
		ReservationsListState.super.call(this, id);
	},

	createModel: function () {
		return new vxml.Say('ReservationsListState menu');
	}
});

module.exports = ReservationsListState;
