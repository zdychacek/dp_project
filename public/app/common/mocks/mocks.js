define([
	'angular',
	'common/mocks/mocksData',
	'angular-mocks'
], function (angular, mocksData) {
	'use strict';

	angular.module('mocks', ['ngMockE2E'])
		.run(function ($httpBackend) {
			mocksData.forEach(function (section) {
				var resources = section.resources;

				resources.forEach(function (res) {
					var url = '/api/v1' + res.url;

					url = url.replace(/{[^}]+}/g, 'PARAM');
					url = url.replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + '' + '-]', 'g'), '\\$&');
					url = url.replace(/PARAM/g, '([^&]*)');
					url = new RegExp(url + '$');

					switch (res.method) {
						case 'GET':
							$httpBackend.whenGET(url).respond(res.responses[0].status, res.responses[0].body);
							break;
						case 'POST':
							$httpBackend.whenPOST(url).respond(res.responses[0].status, res.responses[0].body);
							break;
						case 'PUT':
							$httpBackend.whenPUT(url).respond(res.responses[0].status, res.responses[0].body);
							break;
						case 'DELETE':
							$httpBackend.whenDELETE(url).respond(res.responses[0].status, res.responses[0].body);
							break;
					}
				});
			});

			// nechame projit pozadavky na prihlaseni/odhlaseni apod. a staticke soubory
			$httpBackend.whenGET(/^\/security\/|^security\/|^\/static\/|^static\//).passThrough();
			$httpBackend.whenPOST(/^\/security\/|^security\//).passThrough();
		});
});