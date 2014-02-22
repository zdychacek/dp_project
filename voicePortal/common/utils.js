'use strict';

module.exports = {

	convertDate: function (date) {
		var months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

		return {
			day: date.getDate(),
			month: months[date.getMonth()],
			year: date.getFullYear(),
			hours: date.getHours(),
			minutes: date.getMinutes()
		};
	}
};
