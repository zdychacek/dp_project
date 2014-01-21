'use strict';

var util = require('util'),
	vxml = require('../../lib/vxml'),
	ReservationsListFlow = require('./ReservationsListFlow');

var ReservationsListState = function (id, userVar) {
	vxml.State.call(this, id);

	this.addNestedCallFlow(new ReservationsListFlow(userVar));
}

util.inherits(ReservationsListState, vxml.State);

module.exports = ReservationsListState;
