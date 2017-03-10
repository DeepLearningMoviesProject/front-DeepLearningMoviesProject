'use strict';

/**
 * @ngdoc function
 * @name frontMoviesDeepLearningApp.controller:ImproveaccuracyCtrl
 * @description
 * # ImproveaccuracyCtrl
 * Controller of the frontMoviesDeepLearningApp
 */
angular.module('frontMoviesDeepLearningApp')
  .controller('ImproveaccuracyCtrl', ['$rootScope','$scope', '$mdDialog', '$timeout', 'SearchMoviesFactory', 'DiscoverMoviesFactory', 'MoviesDetailsFactory', 'AddMovieFactory', 'UpdateMovieFactory', 'DeleteMovieFactory', function ($rootScope, $scope, $mdDialog, $timeout, SearchMoviesFactory, DiscoverMoviesFactory, MoviesDetailsFactory, AddMovieFactory, UpdateMovieFactory, DeleteMovieFactory) {

    $scope.showLoadingBar();
    $scope.movieDetails = {};
    $scope.globalPage = 0;
    $scope.firstLoad = false;

    $scope.moviesCurrentlyUpdated = new Map();

    $scope.removeItem = function(movieId) {
      var index = $scope.moviesCurrentlyUpdated.indexOf(item);
       $scope.moviesCurrentlyUpdated.splice(index, 1);
    };


    /**
     * Send the new movie annotated to the server
     * @param {[type]}
     */
    $scope.addMovieToDB = function(movie) {
      $scope.moviesCurrentlyUpdated.set(movie.id, movie.liked);
      console.log(movie);
      AddMovieFactory.addMovie(movie,
        function(movie) {
          // $rootScope.moviesEvaluation = $scope.objToStrMap(movies.movies);
          console.log("Movie imported successfully!", movie);
          // $rootScope.moviesEvaluation.set(movie.id.toString(),movie.liked);
          // $scope.moviesCurrentlyUpdated.delete(movie.id);
          $scope.moviesCurrentlyUpdated.delete(movie.id);
          $timeout(function(){
            $rootScope.moviesEvaluation.set(movie.id.toString(),movie.liked);
          }, 10);
          //Staffing refresh
        }, function() {
          console.log('Movie creation failed!');
          $scope.moviesCurrentlyUpdated.delete(movie.id);
          console.log($scope.moviesCurrentlyUpdated);
        }
      );
    };


    /**
     * Send the new movie annotated to the server
     * @param {[type]}
     */
    $scope.updateMovieToDB = function(movie) {
      $scope.moviesCurrentlyUpdated.set(movie.id, movie.liked);
      console.log(movie);
      UpdateMovieFactory.updateMovie(movie,
        function(movie) {
          // $rootScope.moviesEvaluation = $scope.objToStrMap(movies.movies);
          console.log("Movie updated successfully!", movie);
          // $rootScope.moviesEvaluation.set(movie.id.toString(),movie.liked);
          // $scope.moviesCurrentlyUpdated.delete(movie.id);
          $scope.moviesCurrentlyUpdated.delete(movie.id);
          $timeout(function(){
            $rootScope.moviesEvaluation.set(movie.id.toString(),movie.liked);
          }, 10);
          //Staffing refresh
        }, function() {
          console.log('Movie update failed!');
          $scope.hideLoadingBar();
        }
      );
    };


    /**
     * Send the new movie annotated to the server
     * @param {[type]}
     */
    $scope.deleteMovieToDB = function(movie) {
      $scope.moviesCurrentlyUpdated.set(movie.id, movie.liked);
      console.log(movie);
      DeleteMovieFactory.deleteMovie(movie,
        function(movie) {
          // $rootScope.moviesEvaluation = $scope.objToStrMap(movies.movies);
          console.log("Movie deleted successfully!", movie);
          $scope.moviesCurrentlyUpdated.delete(movie.id);
          $timeout(function(){
            $rootScope.moviesEvaluation.delete(movie.id.toString());
          }, 10);
          //Staffing refresh
        }, function() {
          console.log('Movie deletion failed!');
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
        $scope.deleteMovieToDB({id:movieId});
      } else if ($rootScope.moviesEvaluation.has(movieId.toString())){
        $scope.updateMovieToDB({id:movieId,liked:note});
        // $rootScope.moviesEvaluation.set(movieId.toString(),note);
      } else {
        $scope.addMovieToDB({id:movieId,liked:note});
      }
      // console.log($rootScope.moviesEvaluation);
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



  }]);
