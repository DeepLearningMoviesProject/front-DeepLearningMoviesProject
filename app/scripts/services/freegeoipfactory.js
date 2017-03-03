'use strict';

/**
 * @ngdoc service
 * @name frontMoviesDeepLearningApp.FreeGeoIpFactory
 * @description
 * # FreeGeoIpFactory
 * Factory in the frontMoviesDeepLearningApp.
 */
angular.module('frontMoviesDeepLearningApp')
  .factory('FreeGeoIpFactory', ['$resource', function ($resource) {
    // var userWebservices = WebServices.webServicesGroup;
    return $resource(
      "http://freegeoip.net/json/", //urls
      {},                    //params
      { getGeolocation : {                    //actions
        method: 'JSONP',
        params: {callback: 'JSON_CALLBACK'},
        headers: {'Content-Type': 'application/json'}
        // ,isArray: true
      }
    });
  }]);
