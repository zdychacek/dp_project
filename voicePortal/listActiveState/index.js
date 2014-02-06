'use strict';

var vxml = require('vxml'),
	ListActiveFlow = require('./flow');

var ListActiveState = vxml.State.extend({

	constructor: function (id, userVar) {
		ListActiveState.super.call(this, id);

		this.addNestedCallFlow(new ListActiveFlow(userVar));
	}
});

module.exports = ListActiveState;
