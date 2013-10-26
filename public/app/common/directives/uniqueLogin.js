define([
  'angular',
  'common/resources/user'
], function (angular) {
  'use strict';

	angular.module('directives.uniqueLogin', ['resources.user'])
		.directive('uniqueLogin', ['User', function (User) {
			var toId;

			return {
				restrict: 'A',
				require: 'ngModel',
				link: function (scope, elem, attr, ctrl) {
					var callback;

					if (attr.afterServerValidationCallback && scope[attr.afterServerValidationCallback]) {
						callback = scope[attr.afterServerValidationCallback];
					}

					scope.$watch(attr.ngModel, function (value) {
						if (toId) {
							clearTimeout(toId);
						}

						ctrl.requestRunning = true;

						toId = setTimeout(function () {
							User.checkLogin(value).then(function (data) {
								if (typeof callback === 'function') {
									callback(data.isValid, function (result) {
										ctrl.$setValidity('uniqueLogin', result);
										ctrl.requestRunning = false;	
									});
								}
								else {
									ctrl.$setValidity('uniqueLogin', data.isValid);
									ctrl.requestRunning = false;
								}
							});
						}, 200);
					});
				}
			};
		}]);
});