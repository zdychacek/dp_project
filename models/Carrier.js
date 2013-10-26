const mongoose = require('mongoose'),
	lastModified = require('./plugins/lastModified');

var Carrier = new mongoose.Schema({
	name: String,
	logo: String,
	disabled: { type: Boolean, default: false }
});

Carrier.plugin(lastModified);

module.exports = mongoose.model('Carrier', Carrier);