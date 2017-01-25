'use strict';

/**
 * @ngdoc service
 * @name frontMoviesDeepLearningApp.TMDBFactories
 * @description
 * # TMDBFactories
 * Factory in the frontMoviesDeepLearningApp.
 */
angular.module('frontMoviesDeepLearningApp')
  .factory('SearchMoviesFactory', ['$resource', '$rootScope', 'WebServices', function ($resource, $rootScope, WebServices) {
    var userWebservices = WebServices.webServicesGroup;
    return $resource(
      userWebservices.search.movies, //urls
      {},                    //params
      { getMoviesByName : {                    //actions
        method: 'JSONP',
        params: {api_key:"ff3f07bf3577a496a2f813488eb29980", language:"fr-FR", query:'@query'},
        headers: {'Content-Type': 'application/json'}
        // ,isArray: true
      }
    });
  }]);
