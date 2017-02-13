'use strict';

/**
 * @ngdoc function
 * @name frontMoviesDeepLearningApp.controller:PrimaryCtrl
 * @description
 * # PrimaryCtrl
 * Controller of the frontMoviesDeepLearningApp
 */
angular.module('frontMoviesDeepLearningApp')
  .controller('PrimaryCtrl', ['$scope', '$rootScope', '$mdSidenav', '$location', function ($scope, $rootScope, $mdSidenav, $location) {

    $rootScope.moviesEvaluation = new Map();

    $scope.loadingBar = false;

    /**
     * Function to toggle the main loading bar
     * @return {[type]} [description]
     */
    $scope.loadingBarToggle = function() {
      $scope.loadingBar = !$scope.loadingBar;
    };

    /**
     * Function to hide the main loading bar
     * @return {[type]} [description]
     */
    $scope.hideLoadingBar = function() {
      $scope.loadingBar = false;
    };

    /**
     * Function to display the main loading bar
     * @return {[type]} [description]
     */
    $scope.showLoadingBar = function() {
      $scope.loadingBar = true;
    };

    // Menu items
    $scope.menu = [
      {
        link : '/',
        title: 'Accueil',
        icon: 'action:ic_home_24px' // we have to use Google's naming convention for the IDs of the SVGs in the spritesheet
      },
      {
        link : '/annotatedMovies',
        title: 'Mes films annotés',
        icon: 'av:ic_movie_24px' // we have to use Google's naming convention for the IDs of the SVGs in the spritesheet
      },
      {
        link : '/stats',
        title: 'Mes statistiques',
        icon: 'editor:ic_insert_chart_24px' // we have to use Google's naming convention for the IDs of the SVGs in the spritesheet
      },
      {
        link : '/improveAccuracy',
        title: 'Améliorer mes prédictions',
        icon: 'action:ic_thumbs_up_down_24px'
      }
    ];

    /**
     * Use this function to change view with ng-click
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.go = function (path) {
      if ($location.path() === path) {
        $scope.hideLoadingBar();
      } else {
        $location.path(path);
      }
    };


    /**
     * Allow to toggle a sidenav identified by its id
     * @param  {[type]} menuId [description]
     * @return {[type]}        [description]
     */
    $scope.toggleSidenav = function(menuId) {
	    $mdSidenav(menuId).toggle();
	  };

  }]);
