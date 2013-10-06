const mongoose = require('mongoose');

var User = new mongoose.Schema({
	access: String,
	agencyLimit: Number,
	agencyStatus: String,
	avgCpc: Number,
	avgPos: Number,
	changeAccessRequest: String,
	clicks: Number,
	convCost: Number,
	convCostValRate: Number,
	convRate: Number,
	conversions: Number,
	credit: Number,
	creditWithVat: Number,
	ctr: Number,
	dayBudget: Number,
	domain: String,
	exhaustedBudget: Number,
	impressions: Number,
	ish: Number,
	lowQuality: Number,
	missImpressions: Number,
	missedPrice: Number,
	money: Number,
	notDisplayedMessages: Number,
	relationName: String,
	relationStatus: String,
	rusUserId: Number,
	selectAccess: String,
	sendNotice: Boolean,
	stoppedBySchedule: Boolean,
	underForestThreshold: Boolean,
	underLowerThreshold: Boolean,
	username: String,
	verifiedInWallet: Boolean,
	disconnected: Boolean
});

User.statics.generateTestData = function (count) {	
	for (var i = 0; i < count; i++) {
		var isEven = i % 2 == 0;

		var user = new this({
			access: isEven ? 'r' : 'rw',
			agencyLimit: Math.floor(Math.random() * 100),
			agencyStatus: isEven ? 'client-agency' : 'neco jineho',
			avgCpc: Math.random() * 5000,
			avgPos: Math.random() * 5000,
			changeAccessRequest: 'changeAccessRequest ' + isEven,
			clicks: Math.random() * 10000,
			convCost: Math.random() * 10000,
			convCostValRate: Math.random() * 10000,
			convRate: Math.random() * 10000,
			conversions: Math.random() * 10000,
			credit: Math.random() * 10000,
			creditWithVat: Math.random() * 10000,
			ctr: Math.random() * 10000,
			dayBudget: Math.random() * 10000,
			domain: 'domain ' + i,
			exhaustedBudget: i,
			impressions: i + 100,
			ish: i * 5,
			lowQuality: i,
			missImpressions: Math.floor(Math.random() * 500),
			missedPrice: Math.random() * 10000,
			money: Math.random() * 10000 * i,
			notDisplayedMessages: i,
			relationName: 'relationName ' + i,
			relationStatus: 'relationStatus ' + i,
			rusUserId: i,
			selectAccess: 'selectAccess ' + i,
			sendNotice: isEven,
			stoppedBySchedule: !isEven,
			underForestThreshold: !isEven,
			underLowerThreshold: isEven,
			username: 'username ' + i,
			verifiedInWallet: isEven
		});

		user.save();
	}
}

module.exports = mongoose.model('User', User);