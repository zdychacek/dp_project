var simpleSay = new Say('This is message.');

var sayWithSettings = new Say({
	prompt: 'This is message.',
	// OR
	prompt: new Prompt({
		text: 'This is message.',
		bargein: false
	})
});
