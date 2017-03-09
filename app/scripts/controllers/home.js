'use strict';

/**
 * @ngdoc function
 * @name frontMoviesDeepLearningApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the frontMoviesDeepLearningApp
 */
angular.module('frontMoviesDeepLearningApp')
  .controller('HomeCtrl', ['$rootScope','$scope', '$mdDialog', '$timeout', 'SearchMoviesFactory', 'DiscoverMoviesFactory', function ($rootScope, $scope, $mdDialog, $timeout, SearchMoviesFactory, DiscoverMoviesFactory) {
    

    /**
     * Discover random movies
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    $scope.getPopularMovies = function() {
      DiscoverMoviesFactory.getDiscoveredMoviesByName({page: 1}, function (movies){
        movies.$promise.then(function(movies) {
          $scope.popularMovies = movies;
          $scope.randomPopularMovie = movies.results[Math.floor(Math.random() * 20)];

          console.log($scope.popularMovies, $scope.randomPopularMovie);
          return movies;
          //Hide the loading bar when the data are available
          //$scope.hideLoadingBar();
        });
      });
    };

    $scope.getPopularMovies();
  }]);
