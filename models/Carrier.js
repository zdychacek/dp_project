const mongoose = require('mongoose');

var Carrier = new mongoose.Schema({
	name: String,
	logo: String,
	enabled: Boolean
});

module.exports = mongoose.model('Carrier', Carrier);