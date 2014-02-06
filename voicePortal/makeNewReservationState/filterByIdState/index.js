'use strict';

var vxml = require('vxml'),
	FilterByIdFlow = require('./flow');

var FilterByIdState = vxml.State.extend({

	constructor: function (id) {
		FilterByIdState.super.call(this, id);
		
		this.addNestedCallFlow(new FilterByIdFlow());
	},

	onExit: function* (cf, state, event) {
		var filterDef = state.nestedCF.filter;

		cf.filters[filterDef.property] = filterDef.value;

		console.log(cf.filters);
	}
});

module.exports = FilterByIdState;
