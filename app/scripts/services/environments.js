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
    var envTMDB = 'https://api.themoviedb.org/3';

    var env = 'http://ec2-52-42-51-249.us-west-2.compute.amazonaws.com:80';

    /**
     * @returns {string} the environment url
     */
    this.getTMDBEnvironment = function() {
        return envTMDB;
    };

    this.getBackEndEnvironment = function() {
        return env;
    };
});