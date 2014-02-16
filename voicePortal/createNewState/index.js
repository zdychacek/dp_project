'use strict';

var vxml = require('vxml'),
	CreateNewFlow = require('./flow');

var CreateNewState = vxml.State.extend({

	constructor: function (id, userVar, io) {
		CreateNewState.super.call(this, id);

		this.addNestedCallFlow(new CreateNewFlow(userVar, io));
	}
});

module.exports = CreateNewState;
