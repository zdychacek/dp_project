'use strict';

var vxml = require('vxml'),
	FilterByIdState = require('./filterByIdState'),
	MenuState = require('../../common/MenuState'),
	GetAnotherFilterInputState = require('./GetAnotherFilterInputState');

var CreateNewFlow = vxml.CallFlow.extend({

	constructor: function (userVar) {
		CreateNewFlow.super.call(this);

		this.userVar = userVar;
		this.filters = {};
	},

	create: function* () {
		var welcomeMessageState = vxml.State.create('msg', new vxml.Say('Please enter some searching criteria.')),
			filterByIdState = new FilterByIdState('filterById'),
			getAnotherFilterInputState = new GetAnotherFilterInputState('getAnotherFilterInput'),
			filterState = vxml.State.create('filter', new vxml.Say('TODO: filter'));

		var filterSelectionMenuState = new MenuState('mainMenu', [
			{
				prompt: 'To filter by reservation ID',
				targetState: filterByIdState
			}
		]);

		welcomeMessageState.addTransition('continue', filterSelectionMenuState);
		filterByIdState.addTransition('continue', getAnotherFilterInputState);

		getAnotherFilterInputState
			// if one is pressed, than we want to set another filter
			.addTransition('continue', filterSelectionMenuState, function (result) { return result == 1; })
			// if two is pressed, thna we don't want to set another filter
			.addTransition('continue', filterState, function (result) { return result == 2; })

		// register states
		this
			.addState(welcomeMessageState)
			.addState(filterSelectionMenuState)
			.addState(filterByIdState)
			.addState(getAnotherFilterInputState)
			.addState(filterState);
	}
});

module.exports = CreateNewFlow;
