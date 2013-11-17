define(['angular'], function (angular) {
	'use strict';

	angular.module('directives.sortableTable', [])
		.directive('sortableTable', ['$parse', function ($parse) {
			return {
				restrict: 'A',
				// chceme vlastni scope
				scope: true,
				compile: function (element, attrs) {
					var tds = element.find('tr:first td'),
						thead = angular.element('<thead></thead>'),
						theadRow = angular.element('<tr></tr>');

					thead.append(theadRow);

					tds.each(function (i, el) {
						var td = angular.element(el),
							title = td.attr('data-title') || '&nbsp;',
							sortable = td.attr('sortable');

						var template = [
							'<th' + (sortable ? ' ng-class="getCls(\'' + sortable + '\')" sortable="' + sortable + '"' : '') + '>',
								title,
								sortable ? '<span></span>' : '',
							'</th>'
						].join('');

						theadRow.append(angular.element(template));

						td
							.removeAttr('sortable')
							.removeAttr('data-title');
					});

					// pridam vyvtvorenou hlavicku
					element.prepend(thead);

					// link function
					return function ($scope, element, attrs, controller) {
						var th = element.find('th[sortable]'),
							sortColumnGetter, sortDirGetter;

						if (attrs.sortColumn) {
							sortColumnGetter = $parse(attrs.sortColumn);
						}

						if (attrs.sortDir) {
							sortDirGetter = $parse(attrs.sortDir);
						}

						if (!sortColumnGetter || !sortDirGetter) {
							throw new Error('sortableTable: Missing sort-column or sort-dir attribute.');
						}

						th.on('click', function () {
							var sortableValue = angular.element(this).attr('sortable');

							$scope.changeSort(sortableValue);
						});

						$scope.changeSort = function (sort) {
							var currSort = sortColumnGetter($scope),
								dir = sortDirGetter($scope);

							if (currSort === sort) {
								if (dir === 'asc') {
									dir = 'desc';
								}
								else {
									dir = 'asc';
								}
							}
							else {
								dir = 'asc';
							}

							sortColumnGetter.assign($scope, sort);
							sortDirGetter.assign($scope, dir);
							$scope.$apply();
						};

						$scope.getCls = function (field) {
							var cls = ['sortable'];

							if (sortColumnGetter($scope) === field) {
								cls.push('sorted');
								cls.push(sortDirGetter($scope));
							}

							return cls;
						};
					};
				}
			};
		}]);
});