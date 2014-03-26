var promptWithSilence = new Prompt([
	'Hello',
	new Silence('strong'),
	'my name is',
	new Silence('200ms'),
	'Ondrej',
	new Silence('1s')
]);
