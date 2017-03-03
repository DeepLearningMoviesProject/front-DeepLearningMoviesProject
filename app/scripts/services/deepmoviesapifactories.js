'use strict';

/**
 * @ngdoc service
 * @name frontMoviesDeepLearningApp.DeepMoviesApiFactories
 * @description
 * # DeepMoviesApiFactories
 * Factory in the frontMoviesDeepLearningApp.
 */
angular.module('frontMoviesDeepLearningApp')
  .factory('UpdateAnnotatedMoviesFactory', ['$resource', '$rootScope', 'WebServices', function ($resource, $rootScope, WebServices) {
    var userWebservices = WebServices.webServicesGroup;
    return $resource(
      userWebservices.deepMovies.updateMovies, //urls
      {},                    //params
      { updateAnnotatedMovies : {                    //actions
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
        // ,isArray: true
      }
    });
  }])

  .factory('GetLikedMoviesFactory', ['$resource', '$rootScope', 'WebServices', function ($resource, $rootScope, WebServices) {
    var userWebservices = WebServices.webServicesGroup;
    return $resource(
      userWebservices.deepMovies.getLikedMovies, //urls
      {},                    //params
      { getLikedMovies : {                    //actions
        method: 'GET',
        params: {},
        headers: {'Content-Type': 'application/json'}
        // ,isArray: true
      }
    });
  }])

  .factory('GetDislikedMoviesFactory', ['$resource', '$rootScope', 'WebServices', function ($resource, $rootScope, WebServices) {
    var userWebservices = WebServices.webServicesGroup;
    return $resource(
      userWebservices.deepMovies.getDislikedMovies, //urls
      {},                    //params
      { getDislikedMovies : {                    //actions
        method: 'GET',
        params: {},
        headers: {'Content-Type': 'application/json'}
        // ,isArray: true
      }
    });
  }])

  .factory('GetAllMoviesFactory', ['$resource', '$rootScope', 'WebServices', function ($resource, $rootScope, WebServices) {
    var userWebservices = WebServices.webServicesGroup;
    return $resource(
      userWebservices.deepMovies.getAllMovies, //urls
      {},                    //params
      { getAllMovies : {                    //actions
        method: 'GET',
        params: {},
        headers: {'Content-Type': 'application/json'}
        // ,isArray: true
      }
    });
  }]);
