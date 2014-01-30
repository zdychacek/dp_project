'use strict';

var vxml = require('vxml');

var WelcomeState = vxml.State.extend({

	constructor: function (id) {
		WelcomeState.super.call(this, id);
	},

	createModel: function () {
		return new vxml.Say('Welcome to the Airlines voice information system.');
	}
});

module.exports = WelcomeState;
