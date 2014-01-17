const mongoose = require('mongoose');

var CallHistoryItem = new mongoose.Schema({
	sessionId: String,
	startTime: Date,
	endTime: Date // ms
});

CallHistoryItem.virtual('duration').get(function () {
	return new Date(this.endTime - this.startTime);
});

module.exports = mongoose.model('CallHistoryItem', CallHistoryItem);
