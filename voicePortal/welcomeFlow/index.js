'use strict';

var util = require('util'),
	helpers = require('../../lib/helpers'),
	vxml = require('../../lib/vxml');

var WelcomeFlow = function () {
	vxml.CallFlow.call(this);
}

util.inherits(WelcomeFlow, vxml.CallFlow);

WelcomeFlow.prototype.create = function* () {
	this.addState(
		vxml.State.create('welcomeMessage', new vxml.Say('Welcome to the Airlines voice information system.'))
	);
};

module.exports = WelcomeFlow;
