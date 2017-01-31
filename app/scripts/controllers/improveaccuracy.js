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

  }]);
