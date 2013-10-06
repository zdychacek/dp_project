// http://10.0.133.221:9000/
require.config({
	paths: {
		angular: '../components/angular/angular',
		jquery: '../components/jquery/jquery',
		lodash: '../components/lodash/dist/lodash',
		'angular-mocks': '../components/angular-mocks/angular-mocks',
		'angular-ui': '../components/angular-ui/build/angular-ui.',
		'angular-bootstrap': '../components/angular-bootstrap/ui-bootstrap-tpls',
		'angular-resource': '../components/angular-resource/angular-resource'
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
		},
		'angular-resource': {
			deps: ['angular']	
		}
	}
});

require([
	'angular',
	//'angular-ui',
	'angular-bootstrap',
	'angular-resource',

	// services

	// directives
	'common/directives/pagination',
	'common/directives/sortableTable',

	'common/security/index',
	
	// controllers
	'base/MainCtrl',
	'base/HeaderCtrl',
	'dashboard/DashboardCtrl',
	'account/AccountCtrl',
	'flights/FlightsCtrl',
	'admin/users/UsersListCtrl',
	'admin/users/edit/UserEditCtrl'
], function (angular) {
	'use strict';

	var app = angular.module('app', [
		'ngResource',
		
		// services
		
		// directives
		'directives.sortableTable',
		'directives.pagination',

		'security',
		//'mocks',

		// controllers
		'base.MainCtrl',
		'base.HeaderCtrl',
		'dashboard',
		'account',
		'flights',

		'admin.users',
		'admin.users.edit',

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