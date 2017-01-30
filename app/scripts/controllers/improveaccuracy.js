'use strict';

/**
 * @ngdoc function
 * @name frontMoviesDeepLearningApp.controller:ImproveaccuracyCtrl
 * @description
 * # ImproveaccuracyCtrl
 * Controller of the frontMoviesDeepLearningApp
 */
angular.module('frontMoviesDeepLearningApp')
  .controller('ImproveaccuracyCtrl', ['$rootScope','$scope', 'SearchMoviesFactory', 'DiscoverMoviesFactory', function ($rootScope, $scope, SearchMoviesFactory, DiscoverMoviesFactory) {

    /**
     * Search a movie by its name
     */
    $scope.searchMovieByName = function(name) {
      SearchMoviesFactory.getMoviesByName({query: name}, function (movies){
        movies.$promise.then(function(movies) {
          $scope.moviesSearched = movies;

          console.log($scope.moviesSearched);
          return movies;
          //Hide the loading bar when the data are available
          //$scope.hideLoadingBar();
        });
      });
    };

    $scope.discoverMovies = function() {
      //Pick a random page between the first and the 1000th
      var page = Math.floor(Math.random() * 1000) + 1;
      DiscoverMoviesFactory.getDiscoveredMoviesByName({page: page}, function (movies){
        movies.$promise.then(function(movies) {
          $scope.moviesSearched = movies;

          console.log($scope.moviesSearched);
          return movies;
          //Hide the loading bar when the data are available
          //$scope.hideLoadingBar();
        });
      });
    };

    $scope.evaluateMovies = function(movieId, note){
      if ($rootScope.moviesEvaluation.get(movieId.toString()) === note) {
        $rootScope.moviesEvaluation.delete(movieId.toString());
      } else {
        $rootScope.moviesEvaluation.set(movieId.toString(),note);
      }
      console.log($rootScope.moviesEvaluation);
    };


    //Whenever a Map only has strings as keys, you can convert it to JSON by encoding it as an object.
    //Converting a string Map to and from an object
    function strMapToObj(strMap) {
      let obj = Object.create(null);
      for (let [k,v] of strMap) {
        // We don’t escape the key '__proto__'
        // which can cause problems on older engines
        obj[k] = v;
      }
      return obj;
    }

    function objToStrMap(obj) {
      let strMap = new Map();
      for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
      }
      return strMap;
    }

    //The conversion to and from JSON
    function strMapToJson(strMap) {
      return JSON.stringify(strMapToObj(strMap));
    }
    // function jsonToStrMap(jsonStr) {
    //   return objToStrMap(JSON.parse(jsonStr));
    // }


    $scope.uploadFiles = function() {
      var files = document.getElementById('preferences').files;
      console.log(files);
      if (files.length <= 0) {
        return false;
      }
      
      var fr = new FileReader();
      
      fr.onload = function(e) { 
        var result = JSON.parse(e.target.result);
        $rootScope.moviesEvaluation = objToStrMap(result);
        console.log($rootScope.moviesEvaluation);
      };
      
      fr.readAsText(files.item(0));
    };


    /**
     * Save a json file of a data
     * @param  {[type]}
     * @param  {[type]}
     * @return {[type]}
     */
    $scope.saveToPc = function (data, filename) {

      if (!data) {
        console.error('No data');
        return;
      }

      if (!filename) {
        filename = 'download.json';
      }

      // if (typeof data === 'object') {
      //   data = JSON.stringify(data, undefined, 2);
      // }

      data = strMapToJson(data);

      var blob = new Blob([data], {type: 'text/json'});

      // FOR IE:

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, filename);
      }
      else{
        var e = document.createEvent('MouseEvents'),
        a = document.createElement('a');

        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initEvent('click', true, false, window,
          0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
      }
    };

  }]);
