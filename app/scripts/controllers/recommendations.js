'use strict';

/**
 * @ngdoc function
 * @name frontMoviesDeepLearningApp.controller:RecommendationsCtrl
 * @description
 * # RecommendationsCtrl
 * Controller of the frontMoviesDeepLearningApp
 */
angular.module('frontMoviesDeepLearningApp')
  .controller('RecommendationsCtrl', ['$rootScope','$scope', '$mdDialog', '$timeout', '$localStorage', 'SearchMoviesFactory', 'DiscoverMoviesFactory', 'MoviesDetailsFactory', function ($rootScope, $scope, $mdDialog, $timeout, $localStorage, SearchMoviesFactory, DiscoverMoviesFactory, MoviesDetailsFactory) {

    if (!$scope.predictionsFM && $scope.moviesEvaluation.size) {
      $scope.showLoadingBar();
    }
    $scope.movieDetails = {};
    $scope.globalPage = 0;
    $scope.firstLoad = false;
    $scope.allMoviesTemp = [];
    $scope.allMovies = [];

    $scope.Math = window.Math;


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
    $scope.getMovieDetailsById = function(movie_id) {
      MoviesDetailsFactory.getMoviesDetailsById({id: movie_id}, function (movie){
        // console.log(movie);
        $localStorage.allMoviesInfos[movie_id] = movie;
        $scope.allMoviesTemp.push(movie);

        //When all movies have been added to allMoviesTemp, slice it to allMovie to start statistiques extraction
        // if ($scope.allMoviesTemp.length === Object.keys($scope.predictionsFM).length) {
        //   $scope.allMovies = $scope.allMoviesTemp.slice();
        //   $scope.loadingPredictionsFM = false;
        //   $scope.showPredictionsToast();
        // }
        return movie;
        //Hide the loading bar when the data are available
        //$scope.hideLoadingBar();
      },
      function(data) {
        console.log(movie_id);
        $scope.showErrorToast();
        $scope.deleteMovieToDB({id:movie_id});
        delete $rootScope.predictionsFM[movie_id];
        console.log("Get movie details by id failed", data);
      });
    };


    /**
     * Get details of a movie identified by it's id from the local storage (no tmdb calls)
     * @param  {[type]} movie_id [description]
     * @return {[type]}          [description]
     */
    $scope.getMovieDetailsByIdFromLS = function(movie_id) {
      var movie = $localStorage.allMoviesInfos[movie_id];
      $scope.allMoviesTemp.push(movie);
      
      //When all movies have been added to allMoviesTemp, slice it to allMovie to start statistiques extraction
      // if ($scope.allMoviesTemp.length === Object.keys($scope.predictionsFM).length) {
      //   $scope.allMovies = $scope.allMoviesTemp.slice();
      //   $scope.loadingPredictionsFM = false;
      //   $scope.showPredictionsToast();
      // }
      return movie;
    };

    /**
     * Get next page of the annotated movies of an user (get movies informations of a page)
     * @param  {[type]} firstIndex [description]
     * @return {[type]}            [description]
     */
    $scope.getMoviesInfosFromPredictionsIds = function() {
      var cpt = 0;
      $scope.showLoadingBar();
      var iterArray = Object.keys($scope.predictionsFM);
      //Array.from($scope.moviesEvaluation.keys()); //Array containing the key of the moviesEvaluation map
      
      // console.log("getNextMovies lastIndexToLoad: " + lastIndexToLoad);
      // $scope.allMoviesTemp = [];
      // $scope.allMovies = [];
      for (var i = 0; i < iterArray.length; i++) {
        if ($localStorage.allMoviesInfos[iterArray[i]]) {
          $scope.getMovieDetailsByIdFromLS(iterArray[i]);
          // console.log("retrieve from LS", $localStorage.allMoviesInfos[iterArray[i]]);
        } else {
          // $scope.getMovieDetailsByIdFromLS(iterArray[i]);

          var waitTime = 275*cpt;
          (function(iterArray, i){  // i will now become available for the someMethod to call
            $timeout(function() {
              $scope.getMovieDetailsById(iterArray[i]);
              // console.log("waitTime",waitTime);
            }, waitTime);
          })(iterArray, i);
          cpt++;
        }
      }
    };
    

    //Wait $scope.moviesEvaluation to be retrieve before retrieving predictions
    $scope.$watch('moviesEvaluation',function(){
      if($scope.moviesEvaluation){
        if (!$scope.loadingPredictionsFirstClassifier && !$scope.predictions && $scope.predictionsFM) {
          console.log("PredictionsFM retrieved, preditions of first classifier can start !");
          //$scope.getPredictionsFromBack();
        }
         if(!$scope.predictionsFM && $scope.moviesEvaluation.size){
          console.log("Start FM predictions");
          $scope.getPredictionsFMFromBack();
        }
        // $scope.sentimentAnalysis(["12444", "140607", "44214", "3082", "550"]);
      }
    });

    

   

    $scope.$watch('predictionsFM',function(){
      console.log("predictionFM changed");
      if($scope.predictionsFM){
        console.log("getMoviesInfosFromPredictionsIds");
        $scope.getMoviesInfosFromPredictionsIds();
        // $scope.sentimentAnalysis(["12444", "140607", "44214", "3082", "550"]);
      }
      if (!$scope.loadingPredictionsFirstClassifier && !$scope.predictions && $scope.predictionsFM) {
        console.log("PredictionsFM retrieved, preditions of first classifier can start !");
        $scope.getPredictionsFromBack();
      }
      if ($scope.predictionsFM && angular.equals($scope.popularity,{})) {
        $scope.sentimentAnalysis(Object.keys($scope.predictionsFM));
      }

    });

    $scope.$watch('allMoviesTemp.length',function(){
      console.log("allMoviesTemp.length changed");
      if ($scope.predictionsFM) {
        if ($scope.allMoviesTemp.length === Object.keys($scope.predictionsFM).length) {
          $scope.allMovies = $scope.allMoviesTemp.slice();
          $scope.loadingPredictionsFM = false;
          $scope.showPredictionsToast();
        }
      }
    });

  }]);
