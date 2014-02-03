'use strict';

var vxml = require('vxml'),
	User = require('../../models/User'),
	GetDateDtmfFlow = require('../common/getDateDtmfFlow');

var ReservationsListFlow = vxml.CallFlow.extend({

	constructor: function (userVar) {
		ReservationsListFlow.super.call(this);

		this.userVar = userVar;
	},

	create: function* () {
		this.addState(
			new vxml.State('test1', 'test2')
				.addNestedCallFlow(new GetDateDtmfFlow('Enter date.'))
		);

		this.addState(
			vxml.State.create('test2', new vxml.Say('test 2'))
		);
	}
});

module.exports = ReservationsListFlow;
