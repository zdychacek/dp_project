'use strict';

var util = require('util'),
	User = require('../../models/User'),
	vxml = require('vxml'),
	GetDateDtmfFlow = require('../common/getDateDtmfFlow');

var ReservationsListFlow = function (userVar) {
	vxml.CallFlow.call(this);

	this.userVar = userVar;
}

util.inherits(ReservationsListFlow, vxml.CallFlow);

ReservationsListFlow.prototype.create = function* () {
	this.addState(
		new vxml.State('test1', 'test2')
			.addNestedCallFlow(new GetDateDtmfFlow('Enter date.'))
	);

	this.addState(
		vxml.State.create('test2', new vxml.Say('test 2'))
	);
};

module.exports = ReservationsListFlow;
