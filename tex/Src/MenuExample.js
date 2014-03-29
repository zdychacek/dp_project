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
			State.create('optionOne', new Exit('Selected option is one.'));

		var optionTwoState =
			State.create('optionTwo', new Exit('Selected option is two.'));

		var optionThreeState =
			State.create('optionThree', new Exit('Selected option is three.'));

		var invalidSelState =
			State.create('invalidSelection', new Exit('Invalid option.'));

		var menuState =
			State.create('menu', new Ask({
				prompt: 'Press one, two or three.',
				grammar: new BuiltinGrammar({
					type: 'digits',
					length: 1
				})
			}))
			.addOnEntryAction(function* () {
				console.log('You have entered menu state.');
			})
			.addOnExitAction(function* () {
				console.log('You have leaved menu state.');
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
			.addTransition('continue', invalidSelState, function (result) {
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
			.addState(invalidSelState);
	}
});
