'use strict';

var vxml = require('vxml');

var OtherInfoState = vxml.State.extend({

	constructor: function (id, reservation) {
		OtherInfoState.super.call(this, id);

		this._reservation = reservation;
	},

	createModel: function (cf) {
		var res = this._reservation,
			durationInMinutes = res.totalFlightDuration;

		var hours = Math.floor(durationInMinutes / 60),
			minutes = durationInMinutes % 60;

		var prompt = new vxml.Prompt([
			'Total flight duration is ' + hours + ' hours and ' + minutes + ' minutes.',
			new vxml.Silence('weak'),
			'Flight has ' + (res.transfersCount? res.transfersCount + ' transfers' : ' no transfers') + '.'
		]);

		return new vxml.Say(prompt);
	}
});

module.exports = OtherInfoState;
