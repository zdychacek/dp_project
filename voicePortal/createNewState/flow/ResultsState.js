'use strict';

var	vxml = require('vxml'),
	ReservationsContainerFlow = require('../../common/ReservationsContainerFlow');

var ResultsState = vxml.State.extend({

	constructor: function (id, resultsVar) {
		ResultsState.super.call(this, id);

		this.addNestedCallFlow(new ReservationsContainerFlow(resultsVar));
	}
});

module.exports = ResultsState;
