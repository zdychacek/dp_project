'use strict';

var vxml = require('vxml'),
	utils = require('../../../utils');

var DepartureInfoState = vxml.State.extend({

	constructor: function (id, reservation) {
		DepartureInfoState.super.call(this, id);

		this._reservation = reservation;
	},

	_formatDateAndTime: function (date) {
		var msg = [];

		msg.push(' on ' + date.day + ' ' + date.month + ' ' + date.year);
		msg.push(new vxml.Silence('weak'));
		msg.push(' at ' + date.hours + ' and ' + date.minutes);

		return msg;
	},

	createModel: function (cf) {
		var res = this._reservation,
			departureTime = utils.convertDate(res.departureTime),
			msg = [
				new vxml.TtsMessage('Departure from ' + res.fromDestination),
				new vxml.Silence('weak')
			];

		Array.prototype.push.apply(msg, new this._formatDateAndTime(departureTime));
		msg.push(new vxml.Silence('weak'));

		return new vxml.Say(new vxml.Prompt(msg));
	}
});

module.exports = DepartureInfoState;
