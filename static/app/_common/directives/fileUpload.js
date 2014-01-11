define(['angular'], function (angluar) {
	'use strict';

	angular.module('directives.fileUpload', [])
		.directive('fileUpload', function () {
			return {
				scope: true,
				link: function (scope, el, attrs) {
					el.bind('change', function (event) {
						var files = event.target.files;

						for (var i = 0, l = files.length; i < l; i++) {
							scope.$emit('fileSelected', {
								file: files[i]
							});
						}
					});
				}
			};
		});
});