'use strict';

var util = require('util'),
	vxml = require('../../lib/vxml'),
	CancelAllReservationsFlow = require('./CancelAllReservationsFlow');

var CancelAllReservationsState = function (id, userVar) {
	vxml.State.call(this, id);

	this.addNestedCallFlow(new CancelAllReservationsFlow(userVar));
}

util.inherits(CancelAllReservationsState, vxml.State);

module.exports = CancelAllReservationsState;
