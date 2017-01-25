'use strict';

/**
 * @ngdoc function
 * @name frontMoviesDeepLearningApp.controller:PrimaryCtrl
 * @description
 * # PrimaryCtrl
 * Controller of the frontMoviesDeepLearningApp
 */
angular.module('frontMoviesDeepLearningApp')
  .controller('PrimaryCtrl', ['$scope', '$mdSidenav', function ($scope, $mdSidenav) {

    /**
     * Allow to toggle a sidenav identified by its id
     * @param  {[type]} menuId [description]
     * @return {[type]}        [description]
     */
    $scope.toggleSidenav = function(menuId) {
	    $mdSidenav(menuId).toggle();
	  };

  }]);
