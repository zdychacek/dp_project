'use strict';

var vxml = require('vxml');

var ReservationInfoState = vxml.State.extend({

	constructor: function (reservation, isFirst, isLast, hasEditMenu) {
		ReservationInfoState.super.call(this, 'reservation_' + reservation._id);

		this._reservation = reservation;
		this._isFirst = isFirst;
		this._isLast = isLast;
		this._hasEditMenu = hasEditMenu;
	},

	_createReservationAudios: function () {
		var res = this._reservation,
			info = [
				// add emphasis tag support
				new vxml.TtsMessage('Flight from ' + res.fromDestination + ' to ' + res.toDestination + ' with ' + (res.transfersCount? res.transfersCount + ' transfers' : ' no transfers') + '.'),
				new vxml.TtsMessage('Departure at '),
					new vxml.SayAs(res.departureTime, 'date'),
					new vxml.Silence('weak'),
					new vxml.SayAs(res.departureTime, 'time'),
				new vxml.TtsMessage(', arrival at '),
					new vxml.SayAs(res.arrivalTime, 'date'),
					new vxml.Silence('weak'),
					new vxml.SayAs(res.arrivalTime, 'time'),
				new vxml.TtsMessage('. Flight has ' + (res.freeCapacity? res.freeCapacity + ' free places' : ' no free places') + '. '),
				new vxml.TtsMessage('Price is '),
					new vxml.SayAs(res.price, 'currency'),
				new vxml.TtsMessage('.')
			];

		return info;
	},

	createModel: function (cf) {
		var reservationAudios = this._createReservationAudios(),
			menuText = [];

		menuText.push(' Press one to repeat');

		if (!this._isLast) {
			menuText.push('press two to continue')
		}

		if (!this._isFirst) {
			menuText.push('press three to go to previous reservation');
		}

		if (this._hasEditMenu) {
			menuText.push('press five to change reservation status');
		}

		menuText.push('or press four to return to main menu.')
		menuText = menuText.join(', ');

		var prompt = new vxml.Prompt();
		prompt.audios = [];

		reservationAudios.forEach(function (audio) {
			prompt.audios.push(audio);
		});

		// menu text
		prompt.audios.push(new vxml.TtsMessage(menuText));

		return new vxml.Ask({
			prompt: prompt,
			grammar: new vxml.BuiltinGrammar({ type: 'digits', length: 1 })
		});
	}
});

module.exports = ReservationInfoState;
