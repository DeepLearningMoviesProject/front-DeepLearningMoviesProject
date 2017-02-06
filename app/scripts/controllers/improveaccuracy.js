'use strict';

/**
 * @ngdoc function
 * @name frontMoviesDeepLearningApp.controller:ImproveaccuracyCtrl
 * @description
 * # ImproveaccuracyCtrl
 * Controller of the frontMoviesDeepLearningApp
 */
angular.module('frontMoviesDeepLearningApp')
  .controller('ImproveaccuracyCtrl', ['$rootScope','$scope', '$mdDialog', '$timeout', 'SearchMoviesFactory', 'DiscoverMoviesFactory', 'MoviesDetailsFactory', function ($rootScope, $scope, $mdDialog, $timeout, SearchMoviesFactory, DiscoverMoviesFactory, MoviesDetailsFactory) {

    $scope.showLoadingBar();
    $scope.movieDetails = {};
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


    $scope.discoverMovies(1);


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


    /**
     * Get details of a movie identified by its id
     */
    $scope.getMovieDetails = function(movie_id) {
      MoviesDetailsFactory.getMoviesDetailsById({id: movie_id}, function (movie){
        movie.$promise.then(function(movie) {
          // console.log(movie);
          $scope.allMoviesTemp.push(movie);
          if ($scope.moviesEvaluation.get(movie_id) === 0) {
            $scope.dislikedMovies.push(movie);
          } else if ($scope.moviesEvaluation.get(movie_id) === 1) {
            $scope.likedMovies.push(movie);
          }

          // console.log("getMovieDetailsById lastIndexToLoad: ", (lastIndexToLoad - (($scope.paging.current-1)*$scope.rangeIndex)));

          //When all movies of the page have been added to allMoviesTemp, slice it to allMovie to allow movie display
          //lastIndexToLoad - (($scope.paging.current-1)*$scope.rangeIndex) = how many movies for the current page have to be loaded
          if ($scope.allMoviesTemp.length === lastIndexToLoad - (($scope.paging.current-1)*$scope.rangeIndex)) {
            $scope.allMovies = $scope.allMoviesTemp.slice();
          }
          return movie;
          //Hide the loading bar when the data are available
          //$scope.hideLoadingBar();
        });
      });
    };




    /**
     * Show the dialog to view movie details
     * @param  {[type]} ev [description]
     * @return {[type]}    [description]
     */
    $scope.showMovieDetailsDialog = function(ev, movie_id) {
      $scope.movieDetails = {};
      MoviesDetailsFactory.getMoviesDetailsById({id: movie_id}, function (movie){
        movie.$promise.then(function(movie) {
          console.log(movie);
          $mdDialog.show({
            controller: movieDetailsDialogController,
            templateUrl: 'views/moviedetailsdialog.html',
            scope: $scope.$new(),
            targetEvent: ev,
          })
          .then(function() {
            console.log('Show movie details done !');
          }, function() {
            console.log('Movie details dialog closed !');
          });
          $scope.movieDetails = movie;
          return movie;
          //Hide the loading bar when the data are available
          //$scope.hideLoadingBar();
        });
      });
    };



    /**
     * Controller for the movieDetailsDialog
     * @param  {[type]}
     * @param  {[type]}
     * @return {[type]}
     */
    function movieDetailsDialogController($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
    }


  }]);
