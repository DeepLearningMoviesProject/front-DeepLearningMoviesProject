'use strict';

/**
 * @ngdoc function
 * @name frontMoviesDeepLearningApp.controller:PrimaryCtrl
 * @description
 * # PrimaryCtrl
 * Controller of the frontMoviesDeepLearningApp
 */
angular.module('frontMoviesDeepLearningApp')
  .controller('PrimaryCtrl', ['$scope', '$rootScope', '$mdSidenav', '$mdDialog', '$mdToast', '$location', '$auth', '$http', 'GetAllMoviesFactory', 'TrainModelFactory', 'GetPredictionsFactory', 'MoviesDetailsFactory', function ($scope, $rootScope, $mdSidenav, $mdDialog, $mdToast, $location, $auth, $http, GetAllMoviesFactory, TrainModelFactory, GetPredictionsFactory, MoviesDetailsFactory) {

    $rootScope.moviesEvaluation = new Map();

    $scope.loadingBar = false;
    $scope.loadingPredictionsFirstClassifier = false;

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
          $location.path('/login');
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
        },
        function(data) {
          console.log("get movies failed");
        });
      });
    };


    /**
     * Send the new movie annotated to the server
     * @param {[type]}
     */
    $scope.getPredictionsFromBack = function() {
      console.log("Start predicting movies");
      $scope.showLoadingBar();
      $scope.loadingPredictionsFirstClassifier = true;
      GetPredictionsFactory.getPredictions(function(predictions) {
          // $scope.maxAccuracy = Math.max.apply(Math,predictions.map(function(prediction){return prediction.accuracy;}));
          // $scope.minAccuracy = Math.min.apply(Math,predictions.map(function(prediction){return prediction.accuracy;}));
          $scope.loadingPredictionsFirstClassifier = false;
          $rootScope.predictions = predictions;
          console.log($rootScope.predictions);
          $scope.hideLoadingBar();
          $scope.showActionToast();
          return predictions;
          //Staffing refresh
        }, function() {
          console.log("Get predictions failed");
          $scope.loadingPredictionsFirstClassifier = false;
        }
      );
    };



    /**
     * Retrieve all annotated movies of an user from the DB
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    $scope.trainModel = function(name) {
      $scope.showLoadingBar();
      TrainModelFactory.trainModel(function (response){
        response.$promise.then(function(response) {
          $scope.hideLoadingBar();
          console.log(response);
          return response;
          //Hide the loading bar when the data are available
          //$scope.hideLoadingBar();
        },
        function(data) {
          console.log("Model training failed");
        });
      });
    };


    $scope.countMovies = function() {
      var count = {likedMovies: 0, dislikedMovies: 0};
      $scope.moviesEvaluation.forEach(function (element, key) {
        if (element === 1) {
          count.likedMovies++;
        } else {
          count.dislikedMovies++;
        }
      });
      return count;
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

    $scope.showActionToast = function() {
      var toast = $mdToast.simple()
            .textContent('Vos prédictions sont disponibles !')
            .action('Voir mes prédictions')
            .highlightAction(true)
            .hideDelay(10000)
            .position('top right')
      $mdToast.show(toast).then(function(response) {
        if ( response == 'ok' ) {
          $scope.go('/recommendations');
          console.log('You clicked \'OK\'.');
        }
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


    //If the user is authenticated, we can retrieve all the movie already annotated by him
    if ($auth.isAuthenticated()) {
      console.log("Logged in, retrieve movies");
      $scope.getAllMoviesFromDB();
    };


  }]);
