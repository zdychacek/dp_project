'use strict';

var vxml = require('vxml'),
	FilterByIdState = require('./filterByIdState'),
	FilterByDepartureDateState = require('./filterByDepartureDateState'),
	FilterByArrivalDateState = require('./filterByArrivalDateState'),
	MenuState = require('../../common/MenuState'),
	GetAnotherFilterInputState = require('./GetAnotherFilterInputState'),
	FilterState = require('./FilterState'),
	ReservationsListState = require('./reservationsListState');

var CreateNewFlow = vxml.CallFlow.extend({

	constructor: function (userVar, io) {
		CreateNewFlow.super.call(this);

		this.userVar = userVar;
		this.filters = {};
		this.results = [];
		this._io = io;
	},

	create: function* () {
		var welcomeMessageState = vxml.State.create('msg', new vxml.Say('Please enter some filtering criteria.')),
			filterByIdState = new FilterByIdState('filterById'),
			filterByDepartureDateState = new FilterByDepartureDateState('filterByDepartureDate'),
			filterByArrivalDateState = new FilterByArrivalDateState('filterByArrivalDate'),
			getAnotherFilterInputState = new GetAnotherFilterInputState('getAnotherFilterInput'),
			filterState = new FilterState('filterState', new vxml.Var(this, 'filters')),
			reservationsListState = new ReservationsListState('reservationsListState', new vxml.Var(this, 'results'), this.userVar, this._io),

			filterStates = [ filterByIdState, filterByDepartureDateState, filterByArrivalDateState ];

		welcomeMessageState.addOnEntryAction(function* (cf, state, event) {
			// empty filters
			cf.filters = {};
		});

		var filterSelectionMenuState = new MenuState('mainMenu', [
			{
				prompt: 'To find reservation by specifing departure date',
				targetState: filterByDepartureDateState
			},
			{
				prompt: 'To find reservation by specifing arrival date',
				targetState: filterByArrivalDateState
			},
			{
				prompt: 'To find reservation by ID',
				targetState: filterByIdState
			},
		]);

		welcomeMessageState.addTransition('continue', filterSelectionMenuState);

		// add transition for filter states to another input state
		filterStates.forEach(function (state) {
			state.addTransition('continue', getAnotherFilterInputState);
		});

		getAnotherFilterInputState
			// if one is pressed, than we want to set another filter
			.addTransition('continue', filterSelectionMenuState, function (result) { return result == 1; })
			// if two is pressed, than we don't want to set another filter
			.addTransition('continue', filterState, function (result) { return result == 2; })

		filterState.addTransition('continue', reservationsListState);

		// register states
		this
			.addState(welcomeMessageState)
			.addState(filterSelectionMenuState)
			.addStates(filterStates)
			.addState(getAnotherFilterInputState)
			.addState(filterState)
			.addState(reservationsListState);
	}
});

module.exports = CreateNewFlow;
