'use strict';

var util = require('util'),
	vxml = require('../lib/vxml');

var WelcomeState = function (id) {
	vxml.State.call(this, id);

	this.setModel(
		new vxml.Say('Welcome to the Airlines voice information system.')
	);
}

util.inherits(WelcomeState, vxml.State);

module.exports = WelcomeState;
