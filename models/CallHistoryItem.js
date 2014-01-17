const mongoose = require('mongoose');

var CallHistoryItem = new mongoose.Schema({
	sessionId: String,
	startTime: Date,
	duration: Number // ms
});

module.exports = mongoose.model('CallHistoryItem', CallHistoryItem);
