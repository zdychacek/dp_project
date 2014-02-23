'use strict';

var helpers = {
	extend: function (/* ... */) {
		var obj = arguments[0];

		for (var i = 0, l = arguments.length; i < l; i++) {
			var arg = arguments[i];

			if (!arg) {
				continue;
			}

			for (var prop in arg) {
				obj[prop] = arg[prop];
			}
		}

		return obj;
	},

	delay: function (ms) {
		return function (cb) {
			setTimeout(cb, ms);
		};
	}
};

module.exports = helpers;
