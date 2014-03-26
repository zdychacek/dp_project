var yesNoChoices = new vxml.Choices([
	{
		items: ['yes', 'ya', 'dtmf-1', 'dtmf-*'],
		tag: 'yes'
	},
	{
		items: ['no', 'nope', 'dtmf-2', 'dtmf-#'],
		tag: 'no'
	}
]);

var getInput = new Ask({
	prompt: 'Are you happy?',
	grammar: yesNoChoices
});

// ... vytvoreni stavu a precteni vstupnich dat
