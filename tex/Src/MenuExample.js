var MenuExampleCtrl = CallFlow.extend({

	constructor: function () {
		// zavolani konstruktoru bazove tridy
		MenuExampleCtrl.super.call(this);
	},

	create: function* () {
		// vytvoreni jednotlivych stavu
		var gretingState =
			State.create('greeting', new Say('Welcome to menu example.'));

		var optionOneState =
			State.create('optionOne', new Exit('You selected option one.'));

		var optionTwoState =
			State.create('optionTwo', new Exit('You selected option two.'));

		var optionThreeState =
			State.create('optionThree', new Exit('You selected option three.'));

		var invalidSelectionState =
			State.create('invalidSelection', new Exit('You selected an invalid option.'));

		var menuState =
			State.create('menu', new Ask({
				prompt: 'Press one, two or three.',
				grammar: new BuiltinGrammar({
					type: 'digits',
					length: 1
				})
			}))
			.addOnEntryAction(function* () {
				console.log('You\'ve entered menu state.');
			})
			.addOnExitAction(function* () {
				console.log('You\'ve leaved menu state.');
			})
			.addTransition('continue', optionOneState, function (result) {
				return result == 1;
			})
			.addTransition('continue', optionTwoState, function (result) {
				return result == 2;
			})
			.addTransition('continue', optionThreeState, function (result) {
				return result == 3;
			})
			.addTransition('continue', invalidSelectionState, function (result) {
				return [1, 2, 3].indexOf(result) == -1;
			});

		gretingState.addTransition('continue', menuState);

		// registrace stavu do kontejneru
		this
			.addState(gretingState)
			.addState(menuState)
			.addState(optionOneState)
			.addState(optionTwoState)
			.addState(optionThreeState)
			.addState(invalidSelectionState);
	}
});
