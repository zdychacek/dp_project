'use strict';

var vxml = require('vxml'),
	CancelActiveFlow = require('./flow');

var CancelActiveState = vxml.State.extend({

	constructor: function (id, userVar, io) {
		CancelActiveState.super.call(this, id);

		this.addNestedCallFlow(new CancelActiveFlow(userVar, io));
	}
});

module.exports = CancelActiveState;
