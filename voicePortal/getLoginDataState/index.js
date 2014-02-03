'use strict';

var vxml = require('vxml'),
	GetLoginDataFlow = require('./flow');

var GetLoginDataState = vxml.State.extend({

	constructor: function (id) {
		GetLoginDataState.super.call(this, id);

		this.addNestedCallFlow(new GetLoginDataFlow());
	},

	onExit: function* (cf, state, event) {
		cf.loginData = state.nestedCF.getUserLoginData();
	}
});

module.exports = GetLoginDataState;
