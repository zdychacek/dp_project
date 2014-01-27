'use strict';

var util = require('util'),
	vxml = require('vxml');

var WelcomeState = function (id) {
	vxml.State.call(this, id);
}

util.inherits(WelcomeState, vxml.State);

WelcomeState.prototype.createModel = function () {
	return new vxml.Say('Welcome to the Airlines voice information system.');
}

module.exports = WelcomeState;
