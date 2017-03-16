'use strict';

/**
 * @ngdoc function
 * @name frontMoviesDeepLearningApp.controller:PrimaryCtrl
 * @description
 * # PrimaryCtrl
 * Controller of the frontMoviesDeepLearningApp
 */
angular.module('frontMoviesDeepLearningApp')
  .controller('PrimaryCtrl', ['$scope', '$rootScope', '$timeout', '$mdSidenav', '$mdDialog', '$mdToast', '$location', '$auth', '$http', '$localStorage', 'GetAllMoviesFactory', 'TrainModelFactory', 'GetPredictionsFactory', 'MoviesDetailsFactory', 'SentimentAnalysisFactory', 'AddMovieFactory', 'UpdateMovieFactory', 'DeleteMovieFactory', 'GetUserInfoFactory', 'GetPredictionsFMFactory', function ($scope, $rootScope, $timeout, $mdSidenav, $mdDialog, $mdToast, $location, $auth, $http, $localStorage, GetAllMoviesFactory, TrainModelFactory, GetPredictionsFactory, MoviesDetailsFactory, SentimentAnalysisFactory, AddMovieFactory, UpdateMovieFactory, DeleteMovieFactory, GetUserInfoFactory, GetPredictionsFMFactory) {

    $rootScope.moviesEvaluation = new Map();
    $scope.moviesCurrentlyUpdated = new Map();

    $scope.loadingBar = false;
    $scope.loadingPredictionsFirstClassifier = false;

    $scope.popularity = {};

    //If localStorage variables aren't already created, create them 
    if (!$localStorage.allMoviesInfos) {
      $localStorage.allMoviesInfos = {};
    }

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
        link : '/home',
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


    /**
     * The logout function
     * @return {[type]} [description]
     */
    $scope.logoutFunction = function() {
      if (!$auth.isAuthenticated()) { return; }
      $auth.logout()
        .then(function() {
          console.log('You have been logged out');
          $rootScope.moviesEvaluation = new Map();
          $scope.moviesCurrentlyUpdated = new Map();

          $scope.loadingBar = false;
          $scope.loadingPredictionsFirstClassifier = false;

          $scope.popularity = {};
          $rootScope.predictionsFM = null;
          $rootScope.predictions = null;

          $rootScope.userInfo = {};

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
    };


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
    };


    /**
     * Convert a map into a JSON object
     * @param  {[type]} strMap [description]
     * @return {[type]}        [description]
     */
    $scope.strMapToJson= function(strMap) {
      return JSON.stringify($scope.strMapToObj(strMap));
    };
    // function jsonToStrMap(jsonStr) {
    //   return $scope.objToStrMap(JSON.parse(jsonStr));
    // }


    /**
     * Retrieve all annotated movies of an user from the DB
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    $scope.getAllMoviesFromDB = function() {
      console.log("getAllMoviesFromDB");
      $scope.showLoadingBar();
      GetAllMoviesFactory.getAllMovies(function (movies){
          $scope.hideLoadingBar();
          $rootScope.moviesEvaluation = $scope.objToStrMap(movies.movies);
          console.log($rootScope.moviesEvaluation);
          return movies;
          //Hide the loading bar when the data are available
          //$scope.hideLoadingBar();
        },
        function(data) {
          $scope.hideLoadingBar();
          $scope.showErrorToast();
          console.log("Get movies failed", data);
        }
      );
    };

    /**
     * Retrieve user info from DB (email, username...)
     * @return {[type]}      [description]
     */
    $scope.getUserInfoFromDB = function() {
      console.log("getUserInfoFromDB");
      GetUserInfoFactory.getUserInfo(function (userInfo){
          $rootScope.userInfo = {};
          $rootScope.userInfo.name = userInfo.name;
          $rootScope.userInfo.email = userInfo.email;
          console.log($rootScope.userInfo);
          return userInfo;
          //Hide the loading bar when the data are available
          //$scope.hideLoadingBar();
        },
        function(data) {
          $scope.showErrorToast();
          console.log("Get userInfo failed", data);
        }
      );
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
          $rootScope.predictions = predictions;
          console.log($rootScope.predictions);
          if (predictions.length > 0) {
            var predictionsIds = predictions.map(function(prediction) {return prediction.id.toString();});
            console.log(predictionsIds);
            $scope.sentimentAnalysis(predictionsIds);
          }
          $scope.hideLoadingBar();
          $scope.loadingPredictionsFirstClassifier = false;
          $scope.showPredictionsToast();
          return predictions;
          //Staffing refresh
        }, function() {
          console.log("Get predictions failed");
          $scope.loadingPredictionsFirstClassifier = false;
        }
      );
    };


    /**
     * Send the new movie annotated to the server
     * @param {[type]}
     */
    $scope.getPredictionsFMFromBack = function() {
      console.log("Start predicting FM movies");
      $scope.showLoadingBar();
      $scope.loadingPredictionsFM = true;
      GetPredictionsFMFactory.getPredictionsFM(function(predictionsFM) {
          $rootScope.predictionsFM = predictionsFM;
          delete $rootScope.predictionsFM.$promise;
          delete $rootScope.predictionsFM.$resolved;
          console.log($rootScope.predictionsFM);
          // if (predictionsFM.length > 0) {
          //   var predictionsIds = predictionsFM.map(function(prediction) {return prediction.id.toString();});
          //   console.log(predictionsIds);
          //   $scope.sentimentAnalysis(predictionsIds);
          // }
          $scope.hideLoadingBar();
          
          return predictionsFM;
          //Staffing refresh
        }, function() {
          console.log("Get predictions FM failed");
        }
      );
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



    /**
     * Train the model of an user
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    $scope.trainModel = function() {
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
          console.log("Model training failed", data);
        });
      });
    };


    /**
     * Get the popularity of movies predicted by the system
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    $scope.sentimentAnalysis = function(movies) {
      $scope.showLoadingBar();
      SentimentAnalysisFactory.sentimentAnalysis({"movies": movies}, function (response){
        response.$promise.then(function(response) {
          $scope.hideLoadingBar();
          console.log(response);
          $scope.popularity = Object.assign($scope.popularity, response);
          return response;
          //Hide the loading bar when the data are available
          //$scope.hideLoadingBar();
        },
        function(data) {
          console.log("Sentiment Analysis failed", data);
        });
      });
    };


    /**
     * [countMovies description]
     * @return {[type]} [description]
     */
    $scope.countMovies = function() {
      var count = {likedMovies: 0, dislikedMovies: 0};
      $scope.moviesEvaluation.forEach(function (element) {
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


    /**
     * Display a toast message to prevent the user that the predictions are ready
     * @return {[type]} [description]
     */
    $scope.showPredictionsToast = function() {
      var toast = $mdToast.simple()
            .textContent('Vos prédictions sont disponibles !')
            .action('Voir mes prédictions')
            .highlightAction(true)
            .hideDelay(10000)
            .position('top right');
      $mdToast.show(toast).then(function(response) {
        if ( response === 'ok' ) {
          $scope.go('/recommendations');
        }
      });
    };

    /**
     * Show a toast message to prevent the user that an error occured
     * @return {[type]} [description]
     */
    $scope.showErrorToast = function() {
      var toast = $mdToast.simple()
            .textContent('Un problème est survenu, réessayer plus tard')
            .action('Ok')
            .highlightAction(true)
            .hideDelay(5000)
            .position('top right');
      $mdToast.show(toast).then(function(response) {
        if ( response === 'ok' ) {
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
          }, 20);
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
          }, 20);
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
          }, 20);
          //Staffing refresh
        }, function() {
          console.log('Movie deletion failed!');
          $scope.hideLoadingBar();
        }
      );
    };



    //If the user is authenticated, we can retrieve all the movie already annotated by him
    if ($auth.isAuthenticated()) {
      console.log("Logged in, retrieve userInfo & movies");
      $scope.getUserInfoFromDB();
      $scope.getAllMoviesFromDB();
    }


  }]);
