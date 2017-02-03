'use strict';

/**
 * @ngdoc function
 * @name frontMoviesDeepLearningApp.controller:ImproveaccuracyCtrl
 * @description
 * # ImproveaccuracyCtrl
 * Controller of the frontMoviesDeepLearningApp
 */
angular.module('frontMoviesDeepLearningApp')
  .controller('ImproveaccuracyCtrl', ['$rootScope','$scope', '$timeout', 'SearchMoviesFactory', 'DiscoverMoviesFactory', function ($rootScope, $scope, $timeout, SearchMoviesFactory, DiscoverMoviesFactory) {

    $scope.showLoadingBar();
    $scope.globalPage = 0;

    /**
     * Search a movie by its name
     */
    $scope.searchMovieByName = function(name) {
      if (!name) {
        $scope.hideLoadingBar();
        return;
      }
      $scope.showLoadingBar();
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

    $scope.discoverMovies = function(next) {
      $scope.showLoadingBar();
      var requestedPage = 1;
      if (next == null) {
        //Pick a random page between the first and the 1000th
        requestedPage = Math.floor(Math.random() * 1000) + 1;
        $scope.globalPage = 0;
      } else {
        if ($scope.globalPage + next < 1) {
          requestedPage = 1;
        } else if ($scope.globalPage + next > 1000) {
          requestedPage = 1000;
        } else {
          requestedPage = $scope.globalPage += next;
        }
      }
      console.log(requestedPage);
      DiscoverMoviesFactory.getDiscoveredMoviesByName({page: requestedPage}, function (movies){
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


    $scope.discoverMovies();


    $scope.$on('SUCCESS', function() {
      console.log('ALL PICTURES LOADED SUCCESSFULLY');
    });

    $scope.$on('FAIL', function() {
      console.log('ALL PICTURES LOADED WITH ATLEAST ONE FAILED');
    });

    $scope.$on('ALWAYS', function() {
      $scope.hideLoadingBar();
      console.log('ALL DONE ALWAYS');        
    });

  }]);
