'use strict';

/**
 * @ngdoc function
 * @name frontMoviesDeepLearningApp.controller:PrimaryCtrl
 * @description
 * # PrimaryCtrl
 * Controller of the frontMoviesDeepLearningApp
 */
angular.module('frontMoviesDeepLearningApp')
  .controller('PrimaryCtrl', ['$scope', '$rootScope', '$mdSidenav', '$location', '$auth', '$http', 'GetAllMoviesFactory', function ($scope, $rootScope, $mdSidenav, $location, $auth, $http, GetAllMoviesFactory) {

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
      },
      {
        link : '/recommendations',
        title: 'Mes recommandations',
        icon: 'action:ic_thumb_up_24px'
      }
    ];



    /**
     * Retrieve list of all countries with a lot of details
     * @type {Array}
     */
    $scope.completeCountries = [];
    $http.get('resources/completeCountries.json')
      .success(function(data) {
        $scope.completeCountries = data;
      })
      .error(function() {
        console.log('could not find someFile.json');
      });


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

    $scope.log = function(data) {
      console.log(data);
    };


    /**
     * Allow to toggle a sidenav identified by its id
     * @param  {[type]} menuId [description]
     * @return {[type]}        [description]
     */
    $scope.toggleSidenav = function(menuId) {
	    $mdSidenav(menuId).toggle();
	  };


    $scope.logoutFunction = function() {
      if (!$auth.isAuthenticated()) { return; }
      $auth.logout()
        .then(function() {
          console.log('You have been logged out');
          $location.path('/');
        });
    };



    /**
     * Whenever a Map only has strings as keys, you can convert it to JSON by encoding it as an object.
     * Converting a string Map to and from an object
     * @param  {[type]} strMap [description]
     * @return {[type]}        [description]
     */
    $scope.strMapToObj = function(strMap) {
      var obj = Object.create(null);

      strMap.forEach(function (element, key) {
        obj[key] = element;
      });

      // console.log(obj);
      return obj;
    }


    /**
     * Convert a JavaScript object with key as string to a Map
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    $scope.objToStrMap = function(obj) {
      var strMap = new Map();

      Object.keys(obj).forEach(function(key) {
        strMap.set(key, obj[key]);
      });

      return strMap;
    }


    /**
     * Convert a map into a JSON object
     * @param  {[type]} strMap [description]
     * @return {[type]}        [description]
     */
    $scope.strMapToJson= function(strMap) {
      return JSON.stringify($scope.strMapToObj(strMap));
    }
    // function jsonToStrMap(jsonStr) {
    //   return $scope.objToStrMap(JSON.parse(jsonStr));
    // }


    /**
     * Retrieve all annotated movies of an user from the DB
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    $scope.getAllMoviesFromDB = function(name) {
      $scope.showLoadingBar();
      GetAllMoviesFactory.getAllMovies(function (movies){
        movies.$promise.then(function(movies) {
          $scope.hideLoadingBar();
          $rootScope.moviesEvaluation = $scope.objToStrMap(movies.movies);
          console.log($rootScope.moviesEvaluation);
          return movies;
          //Hide the loading bar when the data are available
          //$scope.hideLoadingBar();
        });
      });
    };


    //If the user is authenticated, we can retrieve all the movie already annotated by him
    if ($auth.isAuthenticated()) {
      $scope.getAllMoviesFromDB();
    };



  }]);
