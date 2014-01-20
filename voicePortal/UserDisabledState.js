'use strict';

var util = require('util'),
	vxml = require('../lib/vxml');

var UserDisabledState = function (id) {
	vxml.State.call(this, id);
}

util.inherits(UserDisabledState, vxml.State);

UserDisabledState.prototype.createModel = function (cf) {
	return new vxml.Exit('Your acount is disabled. Please contact an administrator.');
};

module.exports = UserDisabledState;
