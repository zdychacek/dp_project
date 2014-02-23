'use strict';

var mongoose = require('mongoose'),
	lastModified = require('./plugins/lastModified');

var Carrier = new mongoose.Schema({
	name: String,
	logo: { type: String, default: '' },
	disabled: { type: Boolean, default: false }
});

Carrier.plugin(lastModified);

module.exports = mongoose.model('Carrier', Carrier);
