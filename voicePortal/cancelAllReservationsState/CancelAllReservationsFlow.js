'use strict';

var util = require('util'),
	User = require('../../models/User'),
	vxml = require('../../lib/vxml');

var CancelAllResarvationsFlow = function (userVar) {
	vxml.CallFlow.call(this);

	this.userVar = userVar;
}

util.inherits(CancelAllResarvationsFlow, vxml.CallFlow);

CancelAllResarvationsFlow.prototype.create = function* () {
	var user = this.userVar.getValue(),
		reservations = yield user.listReservations();

	if (!reservations.length) {
		this.addState(
			vxml.State.create('noReservations', new vxml.Say('There are no active reservations.'))
		);
	}
	else {
		this.addState(
			vxml.State.create('ask',
				new vxml.Ask({
					prompt: 'You have ' + reservations.length + ' active reservations. Do you want to cancel them all? Press one for cancel otherwise press two.',
					grammar: new vxml.BuiltinGrammar({ type: 'digits', length: 1 })
				})
			)
				.addTransition('continue', 'cancelAll', function (result) {
					return result == 1;
				})
				.addTransition('continue', 'finalState', function (result) {
					return result == 2;
				})
		);

		this.addState(
			new vxml.State('cancelAll')
				.addTransition('fail', 'cancelOk')
				.addTransition('ok', 'cancelOk')
				.addOnEntryAction(function* (cf, state, event) {
					try {
						yield user.cancelAllReservations();
						yield cf.fireEvent('ok');
					}
					catch (ex) {
						yield cf.fireEvent('fail');
					}
				})
		)

		this.addState(
			vxml.State.create('cancelOk', new vxml.Say('Your reservations were canceled.'))
		);

		this.addState(
			vxml.State.create('cancelError', new vxml.Say('Your reservations were canceled.'))
		);

		this.addState(
			vxml.State.create('finalState', new vxml.Say('Going back to the menu.'))
		);
	}
};

module.exports = CancelAllResarvationsFlow;
