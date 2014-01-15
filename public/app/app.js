require.config({
	paths: {
		angular: '../components/angular/angular',
		jquery: '../components/jquery/jquery.min',
		'angular-ui': '../components/angular-ui/build/angular-ui.min',
		'angular-route': '../components/angular-route/angular-route.min',
		'angular-animate': '../components/angular-animate/angular-animate.min',
		'angular-bootstrap': '../components/angular-bootstrap/ui-bootstrap-tpls.min',
		'angular-datepicker': '../components/angular-datepicker/dist/index',
		'angular-rangeslider': '../components/angular-rangeslider/angular.rangeSlider',
		'moment': '../components/momentjs/moment',
		'spin': '../components/spin.js/spin'
	},
	shim: {
		angular: {
			deps: ['jquery'],
			exports: 'angular'
		},
		'angular-route': {
			deps: ['angular']
		},
		'angular-animate': {
			deps: ['angular']
		},
		'angular-bootstrap': {
			deps: ['angular']
		},
		'angular-datepicker': {
			deps: ['angular']
		},
		'angular-rangeslider': {
			deps: ['angular']
		}
	}
});

require([
	'angular',
	'angular-route',
	'angular-animate',
	'angular-bootstrap',
	'angular-datepicker',
	'angular-rangeslider',
	'config',

	// directives
	'_common/directives/myPagination',
	'_common/directives/sortableTable',
	'_common/directives/repeat',
	'_common/directives/spinner',
	'_common/directives/uniqueLogin',
	'_common/directives/fileUpload',
	'_common/filters/minutesFormatter',
	'_common/security/index',

	'_base/MainCtrl',
	'_base/HeaderCtrl',

	// controllers
	'dashboard/DashboardCtrl',
	'account/AccountCtrl',

	'users/list/UsersListCtrl',
	'users/edit/UserEditCtrl',

	'flights/list/FlightsListCtrl',
	'flights/detail/FlightDetailCtrl',

	'carriers/list/CarriersListCtrl',
	'carriers/edit/CarrierEditCtrl',

	'destinations/DestinationsCtrl',

	'voicePortalSettings/VoicePortalSettingsCtrl'
], function (angular) {
	'use strict';

	var app = angular.module('app', [
		'ngRoute',
		'ngAnimate',
		'datePicker',
		'app.config',
		'ui.bootstrap',
		'ui-rangeSlider',

		// directives
		'directives.sortableTable',
		'directives.myPagination',
		'directives.repeat',
		'directives.spinner',
		'directives.uniqueLogin',
		'directives.fileUpload',
		'filters.minutesFormatter',

		'security',

		// controllers
		'base.MainCtrl',
		'base.HeaderCtrl',
		'dashboard',
		'account',

		'flights.list',
		'flights.detail',

		'users.list',
		'users.edit',

		'carriers.list',
		'carriers.edit',

		'destinations',

		'voicePortalSettings',

		// sablonky proo boostrapovske komponenty
		'template/modal/window.html',
		'template/modal/backdrop.html',
		//'template/typeahead/typeahead.html',
		'template/typeahead/typeahead-popup.html'
	]);

	//TODO: vytahnout do samostatneho souboru
	app.constant('I18N.MESSAGES', {
		'msg.test': 'Testovaci zprava',
		'login.reason.notAuthenticated': 'Nejste přihlášen.',
		'login.reason.notAuthorized': 'Nemáte oprávnění administrátora.',
		'login.error.invalidCredentials': 'Špatné přihlašovací údaje.',
		'errors.route.changeError': 'Chyba při načítání.',
		'save.success': 'Úspěšně uloženo.',
		'save.error': 'Během ukládání došlo k chybě.'
	});

	app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
		$routeProvider.otherwise({
			redirectTo: '/dashboard'
		});

		$locationProvider.html5Mode(true);
	}]);

	// stahnu si informace o prihlasenem uzivateli
	app.run(['security', function (security) {
		security.requestCurrentUser();
	}]);

	angular.element(document).ready(function () {
		angular.bootstrap(document, ['app']);
	});
});
