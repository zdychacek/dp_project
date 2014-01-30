'use strict';

var vxml = require('vxml');

var UserDisabledState = vxml.State.extend({

	constructor: function (id) {
		UserDisabledState.super.call(this, id);
	},

	createModel: function (cf) {
		return new vxml.Exit('Your acount is disabled. Please contact an administrator.');
	}
});

module.exports = UserDisabledState;
