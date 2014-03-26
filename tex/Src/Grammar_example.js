var yesNoGrammar = new Grammar({
	mode: 'voice',
	items: [
		{ text: 'yes', tag: 'yes' },
		{ text: 'yeah', tag: 'yes' },
		{ text: 'ya', tag: 'yes' },
		{ text: 'no', tag: 'no' },
		{ text: 'nope', tag: 'no' }
	]
});

var getInput = new Ask({
	prompt: 'Are you happy?',
	grammar: yesNoGrammar
});

var getInputState = vxml.State.create('getInput', getInput)
	.addOnExitAction(function* (cf, state, event) {
		var answer = event.data;

		if (answer == 'yes') {
			console.log('You are happy.');
		}
		else {
			console.log('You are not happy.');
		}
	});
