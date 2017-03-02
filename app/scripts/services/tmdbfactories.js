'use strict';

/**
 * @ngdoc service
 * @name frontMoviesDeepLearningApp.TMDBFactories
 * @description
 * # TMDBFactories
 * Factory in the frontMoviesDeepLearningApp.
 */
angular.module('frontMoviesDeepLearningApp')
  .factory('DiscoverMoviesFactory', ['$resource', '$rootScope', 'WebServices', function ($resource, $rootScope, WebServices) {
    var userWebservices = WebServices.webServicesGroup;
    return $resource(
      userWebservices.discover.movies, //urls
      {},                    //params
      { getDiscoveredMoviesByName : {                    //actions
        method: 'JSONP',
        params: {api_key:"ff3f07bf3577a496a2f813488eb29980", sort_by:"popularity.desc", "vote_count.gte":"1", language:"fr-FR", page:'@page', callback: 'JSON_CALLBACK'},
        headers: {'Content-Type': 'application/json'}
        // ,isArray: true
      }
    });
  }])

  .factory('SearchMoviesFactory', ['$resource', '$rootScope', 'WebServices', function ($resource, $rootScope, WebServices) {
    var userWebservices = WebServices.webServicesGroup;
    return $resource(
      userWebservices.search.movies, //urls
      {},                    //params
      { getMoviesByName : {                    //actions
        method: 'JSONP',
        params: {api_key:"ff3f07bf3577a496a2f813488eb29980", language:"fr-FR", query:'@query', callback: 'JSON_CALLBACK'},
        headers: {'Content-Type': 'application/json'}
        // ,isArray: true
      }
    });
  }])

  .factory('MoviesDetailsFactory', ['$resource', '$rootScope', 'WebServices', function ($resource, $rootScope, WebServices) {
    var userWebservices = WebServices.webServicesGroup;
    return $resource(
      userWebservices.movies.getDetails, //urls
      {id:'@id'},                    //params
      { getMoviesDetailsById : {                    //actions
        method: 'JSONP',
        params: {api_key:"ff3f07bf3577a496a2f813488eb29980", language:"fr-FR", callback: 'JSON_CALLBACK'},
        headers: {'Content-Type': 'application/json'}
        // ,isArray: true
      }
    });
  }])


  .factory('TestIdFactory', ['$resource', '$rootScope', 'WebServices', function ($resource, $rootScope, WebServices) {
    var userWebservices = WebServices.webServicesGroup;
    return $resource(
      userWebservices.users.testId, //urls
      {},                    //params
      { getTestId : {                    //actions
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
        // ,isArray: true
      }
    });
  }]);
