define(['angular'], function (angular) {
	'use strict';

	angular.module('directives.myPagination', [])
		.directive('myPagination', function () {
			return {
				restrict: 'EA',
				template: [
					'<pagination class="pagination"',
						'total-items="totalItems" ',
						'page="currentPage" ',
						'on-select-page="selectPage(page)" ',
						'items-per-page="itemsPerPage" ',
						'num-pages="totalPages" ',
						'boundary-links="true" ',
						'max-size="5" ',
						'first-text="«" ',
						'previous-text="‹" ',
						'next-text="›" ',
						'last-text="»" />'
				].join('')
			};
		});
});
