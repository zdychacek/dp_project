'use strict';

var util = require('util'),
	vxml = require('../../lib/vxml'),
	GetLoginDataFlow = require('./GetLoginDataFlow.js');

var GetLoginDataState = function (id) {
	vxml.State.call(this, id);

	this.addNestedCallFlow(new GetLoginDataFlow());
	this.addOnExitAction(this.onExitAction);
}

util.inherits(GetLoginDataState, vxml.State);

GetLoginDataState.prototype.onExitAction = function* (cf, state, event) {
	cf.loginData = state.nestedCF.getUserLoginData();
}

module.exports = GetLoginDataState;
