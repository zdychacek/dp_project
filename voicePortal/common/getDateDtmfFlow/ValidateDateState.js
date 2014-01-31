'use strict';

var vxml = require('vxml');

var ValidateDateState = vxml.State.extend({

	constructor: function (id) {
		ValidateDateState.super.call(this, id);
	},

	onEntry: function* (cf, state, event) {
		var result = this._validateDate(event.data);

		if (result.isValid) {
			cf.selectedDate = result.date;
			cf.voiceDate = this._convert(result.date);

			yield cf.fireEvent('continue');
		}
		else {
			yield cf.fireEvent('error');
		}
	},

	_validateDate: function (sDate) {
		var day = sDate.substr(0, 2),
			month = sDate.substr(2, 2),
			year = sDate.substr(4, 4);

		var daysInMonth = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

		/* jshint ignore:start */
		if ((!(year % 4) && year % 100) || !(year % 400)) {
			daysInMonth[1] = 29;
		}
		/* jshint ignore:end */

		return {
			date: new Date(year, month - 1, day),
			isValid: (day <= daysInMonth[--month])
		};
	},

	_convert: function (date) {
		var months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

		return {
			day: date.getDate(),
			month: months[date.getMonth()],
			year: date.getFullYear()
		};
	}
});

module.exports = ValidateDateState;
