'use strict';

/**
 * @ngdoc function
 * @name frontMoviesDeepLearningApp.controller:RecommendationsCtrl
 * @description
 * # RecommendationsCtrl
 * Controller of the frontMoviesDeepLearningApp
 */
angular.module('frontMoviesDeepLearningApp')
  .controller('RecommendationsCtrl', ['$rootScope','$scope', '$mdDialog', '$timeout', 'SearchMoviesFactory', 'DiscoverMoviesFactory', 'MoviesDetailsFactory', 'TestIdFactory', function ($rootScope, $scope, $mdDialog, $timeout, SearchMoviesFactory, DiscoverMoviesFactory, MoviesDetailsFactory, TestIdFactory) {

    $scope.showLoadingBar();
    $scope.movieDetails = {};
    $scope.globalPage = 0;
    $scope.firstLoad = false;


    /**
     * Discover random movies
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    $scope.discoverMovies = function(next) {
      // $scope.showLoadingBar();
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

          $scope.moviesSearched.results = $scope.random($scope.moviesSearched.results);
          console.log($scope.moviesSearched);
          return movies;
          //Hide the loading bar when the data are available
          //$scope.hideLoadingBar();
        });
      });
    };


    $scope.$on('SUCCESS', function() {
      console.log('ALL PICTURES LOADED SUCCESSFULLY');
    });

    $scope.$on('FAIL', function() {
      console.log('ALL PICTURES LOADED WITH ATLEAST ONE FAILED');
    });

    $scope.$on('ALWAYS', function() {
      $scope.hideLoadingBar();
      $scope.firstLoad = true;
      console.log('ALL DONE ALWAYS');        
    });

    $scope.random = function(array) {
		  return array.sort(function() {
		    return .5 - Math.random();
		  });
		}

    $scope.discoverMovies(1);



    $scope.testIdFunction = function() {
      $scope.showLoadingBar();
      TestIdFactory.getTestId(function (result){
        result.$promise.then(function(result) {
          $scope.result = result;

          console.log($scope.result);
          return result;
          //Hide the loading bar when the data are available
          //$scope.hideLoadingBar();
        });
      });
    };



  }]);
