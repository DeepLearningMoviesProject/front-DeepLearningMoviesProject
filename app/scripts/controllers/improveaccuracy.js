'use strict';

/**
 * @ngdoc function
 * @name frontMoviesDeepLearningApp.controller:ImproveaccuracyCtrl
 * @description
 * # ImproveaccuracyCtrl
 * Controller of the frontMoviesDeepLearningApp
 */
angular.module('frontMoviesDeepLearningApp')
  .controller('ImproveaccuracyCtrl', ['$rootScope','$scope', '$mdDialog', '$timeout', 'SearchMoviesFactory', 'DiscoverMoviesFactory', 'MoviesDetailsFactory', 'AddMovieFactory', function ($rootScope, $scope, $mdDialog, $timeout, SearchMoviesFactory, DiscoverMoviesFactory, MoviesDetailsFactory, AddMovieFactory) {

    $scope.showLoadingBar();
    $scope.movieDetails = {};
    $scope.globalPage = 0;
    $scope.firstLoad = false;

    /**
     * Send the new movie annotated to the server
     * @param {[type]}
     */
    $scope.addMovieToDB = function(movie) {
      $scope.showLoadingBar();
      console.log(movies);
      AddMovieFactory.addMovie(movie,
        function(movie) {
          // $rootScope.moviesEvaluation = $scope.objToStrMap(movies.movies);
          console.log("Movie imported successfully!", movie);
          $scope.hideLoadingBar();
          //Staffing refresh
        }, function() {
          console.log('Movie creation failed!');
          $scope.hideLoadingBar();
        }
      );

    };


    /**
     * Search a movie by its name
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
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

    /**
     * Discover random movies
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
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

    /**
     * Evaluate/annote a movie identified by its id (note == 1 : movie liked, note == 0 : movie disliked)
     * @param  {[type]} movieId [description]
     * @param  {[type]} note    [description]
     * @return {[type]}         [description]
     */
    $scope.evaluateMovies = function(movieId, note){
      if ($rootScope.moviesEvaluation.get(movieId.toString()) === note) {
        $rootScope.moviesEvaluation.delete(movieId.toString());
      } else {
        $scope.addMovieToDB({id:movieId,liked:note});
        // $rootScope.moviesEvaluation.set(movieId.toString(),note);
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
      $scope.firstLoad = true;
      console.log('ALL DONE ALWAYS');        
    });



    /**
     * Get details of a movie identified by its id
     * @param  {[type]} movie_id [description]
     * @return {[type]}          [description]
     */
    $scope.getMovieDetails = function(movie_id) {
      MoviesDetailsFactory.getMoviesDetailsById({id: movie_id}, function (movie){
        movie.$promise.then(function(movie) {
          // console.log(movie);
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
            clickOutsideToClose: true
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
