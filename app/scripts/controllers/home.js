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
    

    $scope.$on('SUCCESS', function() {
      console.log('ALL PICTURES LOADED SUCCESSFULLY');
      $scope.randomPopularMovieOpacity = 1;
    });

    $scope.$on('FAIL', function() {
      console.log('ALL PICTURES LOADED WITH ATLEAST ONE FAILED');
    });

    $scope.$on('ALWAYS', function() {
      console.log('ALL DONE ALWAYS');
      $scope.randomPopularMovieOpacity = 1;        
    });


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
          // $timeout(function(){
          // }, 3000);
          

          console.log($scope.popularMovies, $scope.randomPopularMovie);
          return movies;
          //Hide the loading bar when the data are available
          //$scope.hideLoadingBar();
        });
      });
    };

    $scope.getPopularMovies();
  }]);
