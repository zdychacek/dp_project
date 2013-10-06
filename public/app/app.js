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
	'common/services/i18nNotifications',
	'common/services/notifications',
	'common/services/localizedMessages',
	'common/services/breadcrumbs',
	'common/services/httpRequestTracker',

	// directives
	'common/directives/pagination',
	'common/directives/sortableTable',

	'common/security/index',
	//'common/mocks/mocks',
	
	// controllers
	'base/base',
	'welcome/WelcomeCtrl',
	'users/users',
	'campaigns/CampaignsCtrl',
	'reports/ReportsCtrl',
	'tools/exports/ExportsCtrl',
	'tools/imports/ImportsCtrl'
], function (angular) {
	'use strict';

	var app = angular.module('app', [
		'ngResource',
		
		// services
		'services.i18nNotifications',
		'services.breadcrumbs',
		'services.notifications',
		'services.localizedMessages',
		'services.httpRequestTracker',
		
		// directives
		'directives.sortableTable',
		'directives.pagination',

		'security',
		//'mocks',

		// controllers
		'base',
		'welcome',
		'users',
		'campaigns',
		'reports',
		'exports',
		'imports',

		// sablonky proo boostrapovske komponenty
		'template/modal/window.html',
		'template/modal/backdrop.html'
	]);
	
	app.constant('MOJE_KONSTANTA', {
		cislo1: 28,
		cislo2: 14
	});

	//TODO: vytahnout do samostatneho souboru
	app.constant('I18N.MESSAGES', {
		'msg.test': 'Testovaci zprava',
		'login.reason.notAuthenticated': 'Nejste přihlášen.',
		'login.error.invalidCredentials': 'Špatné přihlašovací údaje.',
		'save.success': 'Úspěšně uloženo.',
		'save.error': 'Během ukládání došlo k chybě.'
	});

	app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
		$routeProvider.otherwise({
			redirectTo: '/welcome'
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