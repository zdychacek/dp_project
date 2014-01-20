'use strict';

var util = require('util'),
	vxml = require('../lib/vxml');

var CancelAllReservationsState = function (id) {
	vxml.State.call(this, id);
}

util.inherits(CancelAllReservationsState, vxml.State);

CancelAllReservationsState.prototype.createModel = function () {
	return new vxml.Say('CancelAllReservationsState menu');
}

module.exports = CancelAllReservationsState;
