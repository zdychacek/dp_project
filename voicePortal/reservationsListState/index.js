'use strict';

var util = require('util'),
	vxml = require('vxml'),
	ReservationsListFlow = require('./flow');

var ReservationsListState = function (id, userVar) {
	vxml.State.call(this, id);

	this.addNestedCallFlow(new ReservationsListFlow(userVar));
}

util.inherits(ReservationsListState, vxml.State);

module.exports = ReservationsListState;
