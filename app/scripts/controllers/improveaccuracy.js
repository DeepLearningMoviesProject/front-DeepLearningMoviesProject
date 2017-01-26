'use strict';

/**
 * @ngdoc function
 * @name frontMoviesDeepLearningApp.controller:ImproveaccuracyCtrl
 * @description
 * # ImproveaccuracyCtrl
 * Controller of the frontMoviesDeepLearningApp
 */
angular.module('frontMoviesDeepLearningApp')
  .controller('ImproveaccuracyCtrl', ['$scope', 'SearchMoviesFactory', function ($scope, SearchMoviesFactory) {

    $scope.moviesEvaluation = new Map();

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

    $scope.evaluateMovies = function(movieId, note){
      if ($scope.moviesEvaluation.get(movieId) == note) {
        $scope.moviesEvaluation.delete(movieId);
      } else {
        $scope.moviesEvaluation.set(movieId,note);
      }
      console.log($scope.moviesEvaluation);
    };

  }]);
