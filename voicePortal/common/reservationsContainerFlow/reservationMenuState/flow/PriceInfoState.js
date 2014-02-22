'use strict';

var vxml = require('vxml');

var PriceInfoState = vxml.State.extend({

	constructor: function (id, reservation) {
		PriceInfoState.super.call(this, id);

		this._reservation = reservation;
	},

	createModel: function (cf) {
		var res = this._reservation;

		return new vxml.Say('The price is ' + res.price + ' dollars.');
	}
});

module.exports = PriceInfoState;
