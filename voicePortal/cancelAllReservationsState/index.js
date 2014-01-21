'use strict';

var util = require('util'),
	vxml = require('../../lib/vxml'),
	CancelAllReservationsFlow = require('./flow');

var CancelAllReservationsState = function (id, userVar, io) {
	vxml.State.call(this, id);

	this.addNestedCallFlow(new CancelAllReservationsFlow(userVar, io));
}

util.inherits(CancelAllReservationsState, vxml.State);

module.exports = CancelAllReservationsState;
