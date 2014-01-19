'use strict';

var util = require('util'),
	config = require('./../config'),
	User = require('../../models/User'),
	helpers = require('../../lib/helpers'),
	vxml = require('../../lib/vxml'),
	AskWithNoInputPrompt = require('../components/AskWithNoInputPrompt');

var GetLoginDataFlow = function () {
	vxml.CallFlow.call(this);

	this.enteredLogin = null;
	this.enteredPassword = null;
}

util.inherits(GetLoginDataFlow, vxml.CallFlow);

GetLoginDataFlow.prototype.create = function* () {
	// 1. get user login
	this.addState(
		vxml.State.create('getLogin', new AskWithNoInputPrompt({
			prompt: 'Enter your telephone number as six digits.',
			grammar: new vxml.BuiltinGrammar({ type: 'digits', length: config.loginLength })
		}), 'confirmLogin')
			.addTransition('nomatch', 'getLogin')
			.addTransition('noinput', 'getLogin')
			.addOnExitAction(function* (cf, state, event) {
				// remember entered login
				cf.enteredLogin = event.data;
			})
	);

	var loginConfirm = new vxml.Prompt();
	loginConfirm.audios = [
		new vxml.TtsMessage('You has entered following number '),
		new vxml.SayAs(
			new vxml.Var(this, 'enteredLogin', '. ')
		, 'digits'),
		new vxml.Silence('weak'),
		new vxml.TtsMessage('Press one if this number is correct. Otherwise, press two.')
	];

	// 2. confirm entered login
	this.addState(
		vxml.State.create('confirmLogin', new vxml.Ask({
			prompt: loginConfirm,
			grammar: new vxml.BuiltinGrammar({ type: 'digits', length: 1 })
		}))
			// if user confirm his login, than continue to get password
			.addTransition('continue', 'getPassword', function (result) {
				return result == 1;
			})
			// if user doesn't confirm login, try to get it again
			.addTransition('continue', 'getLogin', function (result) {
				return result == 2;
			})
	);

	// 2. get user password
	this.addState(
		vxml.State.create('getPassword', new AskWithNoInputPrompt({
			prompt: 'Please enter your password as five digits.',
			grammar: new vxml.BuiltinGrammar({ type: 'digits', length: config.passwordLength })
		}))
			.addOnExitAction(function* (cf, state, event) {
				// remember entered password
				cf.enteredPassword = event.data;
			})
	);
};

GetLoginDataFlow.prototype.getUserLoginData = function () {
	return {
		login: this.enteredLogin,
		password: this.enteredPassword
	}
};

module.exports = GetLoginDataFlow;
