'use strict';

var	vxml = require('vxml'),
	Flight = require('../../../models/Flight');

var FilterState = vxml.State.extend({

	constructor: function (id, filtersVar) {
		FilterState.super.call(this, id);

		this._filtersVar = filtersVar;
	},

	onEntry: function* (cf, state, event) {
		var filters = this._filtersVar.getValue(),
			results = yield Flight.filter(filters);

		console.log('filters', filters);

		cf._results = results.items || [];

		// event propagation must be stopped !!!
		event.stopped = true;

		yield cf.fireEvent('continue');
	}
});

module.exports = FilterState;
