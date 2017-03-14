'use strict';

/**
 * @ngdoc function
 * @name frontMoviesDeepLearningApp.controller:RecommendationsCtrl
 * @description
 * # RecommendationsCtrl
 * Controller of the frontMoviesDeepLearningApp
 */
angular.module('frontMoviesDeepLearningApp')
  .controller('RecommendationsCtrl', ['$rootScope','$scope', '$mdDialog', '$timeout', 'SearchMoviesFactory', 'DiscoverMoviesFactory', 'MoviesDetailsFactory', function ($rootScope, $scope, $mdDialog, $timeout, SearchMoviesFactory, DiscoverMoviesFactory, MoviesDetailsFactory) {

    $scope.showLoadingBar();
    $scope.movieDetails = {};
    $scope.globalPage = 0;
    $scope.firstLoad = false;


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
    

    //Wait $scope.moviesEvaluation to be retrieve before retrieving predictions
    $scope.$watch('moviesEvaluation',function(){
      if($scope.moviesEvaluation){
        if (!$scope.loadingPredictionsFirstClassifier && !$scope.predictions) {
          $scope.getPredictionsFromBack();
        }
        // $scope.sentimentAnalysis(["12444", "140607", "44214", "3082", "550"]);
      }
    });

    // $scope.testIdFunction = function() {
    //   $scope.showLoadingBar();
    //   TestIdFactory.getTestId(function (result){
    //     result.$promise.then(function(result) {
    //       $scope.result = result;

    //       console.log($scope.result);
    //       return result;
    //       //Hide the loading bar when the data are available
    //       //$scope.hideLoadingBar();
    //     });
    //   });
    // };



  }]);
