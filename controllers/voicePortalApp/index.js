'use strict';

var util = require('util'),
	vxml = require('../../lib/vxml');

var VoicePortalApp = function () {
	vxml.CallFlow.call(this);
}

// oddedeni
util.inherits(VoicePortalApp, vxml.CallFlow);

// vytvoreni callflow
VoicePortalApp.prototype.create = function *() {
	this.addState(
		vxml.ViewStateBuilder.create('greeting', new vxml.Exit('Hello World')
	), true);
}

module.exports = VoicePortalApp;
