require.config({
	paths: {
		angular: '../components/angular/angular',
		jquery: '../components/jquery/jquery',
		lodash: '../components/lodash/dist/lodash',
		'angular-mocks': '../components/angular-mocks/angular-mocks',
		'angular-ui': '../components/angular-ui/build/angular-ui.',
		'angular-bootstrap': '../components/angular-bootstrap/ui-bootstrap-tpls',
		'spin': '../components/spinjs/spin'
	},
	shim: {
		angular: {
			deps: ['jquery'],
			exports: 'angular'
		},
		'angular-mocks': {
			deps: ['angular']
		},
		'angular-ui': {
			deps: ['angular']
		},
		'angular-bootstrap': {
			deps: ['angular']
		}
	}
});

require([
	'angular',
	//'angular-ui',
	'angular-bootstrap',

	'config',

	// directives
	'common/directives/pagination',
	'common/directives/sortableTable',
	'common/directives/repeat',
	'common/directives/spinner',
	'common/directives/uniqueLogin',
	'common/directives/fileUpload',

	'common/filters/minutesFormatter',

	'common/security/index',

	// controllers
	'base/MainCtrl',
	'base/HeaderCtrl',
	'dashboard/DashboardCtrl',
	'account/AccountCtrl',
	'flights/FlightsCtrl',

	'admin/users/list/UsersListCtrl',
	'admin/users/edit/UserEditCtrl',

	'admin/flights/list/FlightsListCtrl',
	'admin/flights/edit/FlightEditCtrl',

	'admin/carriers/list/CarriersListCtrl',
	'admin/carriers/edit/CarrierEditCtrl',

	'admin/voicePortalSettings/VoicePortalSettingsCtrl'
], function (angular) {
	'use strict';

	var app = angular.module('app', [
		'app.config',

		// directives
		'directives.sortableTable',
		'directives.pagination',
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
		'flights',

		'admin.users.list',
		'admin.users.edit',

		'admin.flights.list',
		'admin.flights.edit',

		'admin.carriers.list',
		'admin.carriers.edit',

		'admin.voicePortalSettings',

		// sablonky proo boostrapovske komponenty
		'template/modal/window.html',
		'template/modal/backdrop.html'
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
