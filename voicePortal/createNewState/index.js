'use strict';

var vxml = require('vxml'),
	CreateNewFlow = require('./flow');

var CreateNewState = vxml.State.extend({

	constructor: function (id, userVar) {
		CreateNewState.super.call(this, id);

		this.addNestedCallFlow(new CreateNewFlow(userVar));
	}
});

module.exports = CreateNewState;
