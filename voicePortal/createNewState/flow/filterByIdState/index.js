'use strict';

var vxml = require('vxml'),
	FilterByIdFlow = require('./flow');

var FilterByIdState = vxml.State.extend({

	constructor: function (id) {
		FilterByIdState.super.call(this, id);
		
		this.addNestedCallFlow(new FilterByIdFlow());
	},

	onExit: function* (cf, state, event) {
		cf.addFilter('_id', state.nestedCF.getId());
	}
});

module.exports = FilterByIdState;
