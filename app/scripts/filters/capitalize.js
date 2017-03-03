'use strict';

/**
 * @ngdoc filter
 * @name frontMoviesDeepLearningApp.filter:capitalize
 * @function
 * @description
 * # capitalize
 * Filter in the frontMoviesDeepLearningApp.
 */
angular.module('frontMoviesDeepLearningApp')
  .filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    };
});
