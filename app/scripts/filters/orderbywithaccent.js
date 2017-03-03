'use strict';

/**
 * @ngdoc filter
 * @name frontMoviesDeepLearningApp.filter:orderByWithAccent
 * @function
 * @description
 * # orderByWithAccent
 * Filter in the frontMoviesDeepLearningApp.
 */
angular.module('frontMoviesDeepLearningApp')
  .filter('orderByWithAccent', function () {
    return function (array, property, reverse) {
        var result = array.sort(function (object1, object2) {
            if (angular.isUndefined(property)) {
                return object1.localeCompare(object2);
            }

            return object1[property].localeCompare(object2[property]);
        });

        return reverse ? result.reverse() : result;
    };
});
