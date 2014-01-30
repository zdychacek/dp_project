'use strict';

var vxml = require('vxml');

var AskState = vxml.State.extend({

	constructor: function (id, reservations) {
		AskState.super.call(this, id);

		this.reservations = reservations;
	},

	createModel: function () {
		var reservationsCount = this.reservations.length;

		return new vxml.Ask({
			prompt: 'You have ' + reservationsCount + ' active reservations. Do you want to cancel them all? Press one for cancel otherwise press two.',
			grammar: new vxml.BuiltinGrammar({ type: 'digits', length: 1 })
		});
	}
});

module.exports = AskState;
