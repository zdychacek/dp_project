'use strict';

var vxml = require('vxml');

var FlightCapacityInfoState = vxml.State.extend({

	constructor: function (id, reservation) {
		FlightCapacityInfoState.super.call(this, id);

		this._reservation = reservation;
	},

	createModel: function (cf) {
		var res = this._reservation;
		var prompt = new vxml.Prompt([
			'Flight has ' + (res.freeCapacity? res.freeCapacity + ' free places' : ' no free places') + '.',
			new vxml.Silence('weak'),
			'Total flight capacity is ' + res.capacity + '.'
		]);

		return new vxml.Say(prompt);
	}
});

module.exports = FlightCapacityInfoState;
