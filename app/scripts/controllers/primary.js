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

    //loading bar display functions
    $scope.loadingBarToggle = function() {
      $scope.loadingBar = !$scope.loadingBar;
    };

    $scope.hideLoadingBar = function() {
      $scope.loadingBar = false;
    };

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
        icon: 'action:ic_dashboard_24px' // we have to use Google's naming convention for the IDs of the SVGs in the spritesheet
      },
      {
        link : '/improveAccuracy',
        title: 'Améliorer mes prédictions',
        icon: 'social:ic_group_24px'
      }
    ];

    //Use this function to change view with ng-click
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
