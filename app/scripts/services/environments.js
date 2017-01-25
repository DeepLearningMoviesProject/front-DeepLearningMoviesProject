'use strict';

/**
 * @ngdoc service
 * @name frontMoviesDeepLearningApp.Environments
 * @description
 * # Environments
 * Service in the frontMoviesDeepLearningApp.
 */
angular.module('frontMoviesDeepLearningApp')
  .service('Environments', function Environments() {
  	// AngularJS will instantiate a singleton by calling "new" on this function
    var env = 'https://api.themoviedb.org/3';

    /**
     * @returns {string} the environment url
     */
    this.getEnvironment = function() {
        return env;
    };
});