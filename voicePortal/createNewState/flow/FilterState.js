'use strict';

var	vxml = require('vxml'),
	Flight = require('../../../models/Flight');

var FilterState = vxml.State.extend({

	constructor: function (id, filtersVar) {
		FilterState.super.call(this, id);

		this.filtersVar = filtersVar;
	},

	onEntry: function* (cf, state, event) {
		var filters = this.filtersVar.getValue();

		cf.results = (yield Flight.filter(filters)).items || [];

		//console.log(cf.results);

		yield cf.fireEvent('continue');
	}
});

module.exports = FilterState;
