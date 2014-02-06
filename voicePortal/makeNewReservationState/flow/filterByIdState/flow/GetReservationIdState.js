'use strict';

var vxml = require('vxml');

var GetReservationIdState = vxml.State.extend({

	constructor: function (id) {
		GetReservationIdState.super.call(this, id);
	},

	createModel: function () {
		return new vxml.Ask({
			prompt: 'Enter ID of reservation you want to search for.',
			grammar: new vxml.BuiltinGrammar({ type: 'digits', maxLength: 8 })
		});
	},

	onExit: function* (cf, state, event) {
		cf.filter = {
			property: 'id',
			value: event.data
		};
	}
});

module.exports = GetReservationIdState;
