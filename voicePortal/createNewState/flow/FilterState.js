'use strict';

var	vxml = require('vxml'),
	Flight = require('../../../models/Flight');

var FilterState = vxml.State.extend({

	constructor: function (id, filtersVar) {
		FilterState.super.call(this, id);

		this.filtersVar = filtersVar;
	},

	onEntry: function* (cf, state, event) {
		var filters = this.filtersVar.getValue(),
			results = yield Flight.filter(filters);

		console.log('filters', filters);

		cf.results = results.items || [];

		// event propagation must be stopped !!!
		event.stopped = true;

		yield cf.fireEvent('continue');
	}
});

module.exports = FilterState;
