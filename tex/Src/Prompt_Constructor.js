var simplePrompt = new Prompt('This is prompt nr. 1.');

var combinedPrompt = new Prompt([
	'This is prompt nr. 2.',
	new Audio('/audio/message.wav')
]);

var promptWithSettings = new Prompt({
	text: 'This is prompt message.',
	audios: [
		'This is prompt nr. 2.',
		new Audio('/audio/message.wav')
	],
	bargein: false,
	bargeinType: 'none',
	timeout: 5,
	language: 'en-US'
});
