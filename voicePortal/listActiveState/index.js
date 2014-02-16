'use strict';

var vxml = require('vxml'),
	ListActiveFlow = require('./flow');

var ListActiveState = vxml.State.extend({

	constructor: function (id, userVar, io) {
		ListActiveState.super.call(this, id);

		this.addNestedCallFlow(new ListActiveFlow(userVar, io));
	}
});

module.exports = ListActiveState;
