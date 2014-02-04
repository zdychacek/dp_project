'use strict';

var vxml = require('vxml');

var ReservationInfoState = vxml.State.extend({
	constructor: function (reservation, isFirst, isLast) {
		ReservationInfoState.super.call(this, 'reservation_' + reservation._id);

		this.reservation = reservation;
		this.isFirst = isFirst;
		this.isLast = isLast;
	},

	createModel: function (cf) {
		var promptText = ['Id is: ' + this.reservation._id + '. Press one to repeat' ];

		if (!this.isLast) {
			promptText.push('press two to continue')
		}

		if (!this.isFirst) {
			promptText.push('press three to go to previous reservation');
		}

		promptText.push('or press four to return to main menu.')

		promptText = promptText.join(', ');

		return new vxml.Ask({
			prompt: promptText,
			grammar: new vxml.BuiltinGrammar({ type: 'digits', length: 1 })
		});
	}
});

module.exports = ReservationInfoState;
