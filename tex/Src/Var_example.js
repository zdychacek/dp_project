var GetAgeCallFlow = CallFlow.extend({
	constructor: function () {
		// zavolani konstruktoru bazove tridy
		GetAgeCallFlow.super.call(this);

		// tato hodnota neni dostupna dokud nedojde k pruchodu prvnim stavem
		this._age = null;
	},

	create: function* () {
		var getInputModel = new Ask({
			prompt: 'Enter your age.',
			grammar: new BuiltinGrammar({ type: 'digits', minLength: 1 })
		});

		var confirmInputModel = new Say([
			'You are ',
			new Var(this, '_age'),
			' years old.'
		]);

		var confirmInputState =
			State.create('confirmInput', confirmInputModel);

		var getInputState = State.create('getInput', getInputModel)
			.addTransition('continue', confirmInputState);
			.addOnExitAction(function* (cf, state, event) {
				// zjisteni veku uzivatele a ulozeni teto hodnoty do vlastnosti _age
				cf._age = event.data;
			});

		this
			.addState(getInputState)
			.addState(confirmInputState);
	}
});
