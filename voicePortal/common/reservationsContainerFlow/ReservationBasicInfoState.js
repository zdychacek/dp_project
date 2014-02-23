'use strict';

var vxml = require('vxml');

var ReservationBasicInfoState = vxml.State.extend({

	constructor: function (reservation, isFirst, isLast) {
		ReservationBasicInfoState.super.call(this, 'reservation_' + reservation._id);

		this._reservation = reservation;
		this._isFirst = isFirst;
		this._isLast = isLast;
	},

	_createReservationAudios: function () {
		var res = this._reservation,
			info = [
				// add emphasis tag support
				'Flight from ' + res.fromDestination,
				new vxml.Silence('weak'),
				' to ' + res.toDestination,
				new vxml.Silence('weak'),
				' with ' + (res.transfersCount? res.transfersCount + ' transfers' : ' no transfers') + '.'
			];

		return info;
	},

	createModel: function (cf) {
		var reservationAudios = this._createReservationAudios(),
			menuText = [];

		menuText.push('To get more information or to change reservation status, press one.');

		if (!this._isFirst) {
			menuText.push('To go to previous reservation, press two.');
		}

		if (!this._isLast) {
			menuText.push('To go to next reservation, press three.');
		}

		menuText.push('To repeat the information, press four.');
		menuText.push('To return to main menu, press five.');
		menuText = menuText.join(' ');

		var prompt = new vxml.Prompt();

		reservationAudios.forEach(function (audio) {
			prompt.addAudio(audio);
		});

		// menu text
		prompt.addAudio(menuText);

		return new vxml.Ask({
			prompt: prompt,
			grammar: new vxml.BuiltinGrammar({ type: 'digits', length: 1 })
		});
	},

	getReservation: function () {
		return this._reservation;
	}
});

module.exports = ReservationBasicInfoState;
