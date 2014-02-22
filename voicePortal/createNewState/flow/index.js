'use strict';

var vxml = require('vxml'),
	FilterByIdState = require('./filterByIdState'),
	FilterByDepartureDateState = require('./filterByDepartureDateState'),
	FilterByDepartureDestinationState = require('./filterByDepartureDestinationState'),
	FilterByArrivalDateState = require('./filterByArrivalDateState'),
	FilterByArrivalDestinationState = require('./filterByArrivalDestinationState'),
	MenuState = require('../../common/MenuState'),
	GetAnotherFilterInputState = require('./GetAnotherFilterInputState'),
	FilterState = require('./FilterState'),
	ReservationsListState = require('./reservationsListState');

var CreateNewFlow = vxml.CallFlow.extend({

	constructor: function (userVar, io) {
		CreateNewFlow.super.call(this);

		this._userVar = userVar;
		this._results = [];
		// sockets support
		this._filters = {};
		this._io = io;
	},

	create: function* () {
		var welcomeMessageState = vxml.State.create('welcomeMessage', new vxml.Say('Please enter some filtering criteria.')),
			filterByIdState = new FilterByIdState('filterById'),
			filterByDepartureDateState = new FilterByDepartureDateState('filterByDepartureDate'),
			filterByDepartureDestinationState = new FilterByDepartureDestinationState('filterByDepartureDestination'),
			filterByArrivalDateState = new FilterByArrivalDateState('filterByArrivalDate'),
			filterByArrivalDestinationState = new FilterByArrivalDestinationState('filterByArrivalDestination'),
			getAnotherFilterInputState = new GetAnotherFilterInputState('getAnotherFilterInput'),
			filterState = new FilterState('filter', new vxml.Var(this, '_filters')),
			reservationsListState = new ReservationsListState('reservationsList', new vxml.Var(this, '_results'), this._userVar, this._io),

			filterStates = [ filterByIdState, filterByDepartureDateState, filterByArrivalDateState, filterByArrivalDestinationState, filterByDepartureDestinationState ];

		welcomeMessageState.addOnEntryAction(function* (cf, state, event) {
			// empty filters setting each time we enter this state to start new searching
			cf._filters = {};
		});

		var filterSelectionMenuState = new MenuState('filterSelectionMenu', [
			{
				prompt: 'To specify departure destination',
				targetState: filterByDepartureDestinationState
			},
			{
				prompt: 'To specify departure date',
				targetState: filterByDepartureDateState
			},
			{
				prompt: 'To specify arrival destination',
				targetState: filterByArrivalDestinationState
			},
			{
				prompt: 'To specify arrival date',
				targetState: filterByArrivalDateState
			},
			{
				prompt: 'To specify reservation ID',
				targetState: filterByIdState
			}
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
			// add filter states
			.addStates(filterStates)
			.addState(getAnotherFilterInputState)
			.addState(filterState)
			// add filtered results list
			.addState(reservationsListState);
	},

	addFilter: function (key, value) {
		this._filters[key] = value;
	}
});

module.exports = CreateNewFlow;
