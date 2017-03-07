'use strict';

/**
 * @ngdoc function
 * @name frontMoviesDeepLearningApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the frontMoviesDeepLearningApp
 */
angular.module('frontMoviesDeepLearningApp')
  .controller('SettingsCtrl', ['$rootScope','$scope', 'UpdateAnnotatedMoviesFactory', '$localStorage', function ($rootScope, $scope, UpdateAnnotatedMoviesFactory, $localStorage) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];


    /**
     * Upload a JSON file to import annotated movies
     * @return {[type]} [description]
     */
    $scope.uploadPreferencesToDB = function() {
      var files = document.getElementById('preferencesToDB').files;
      console.log(files);
      if (files.length <= 0) {
        return false;
      };
      
      var fr = new FileReader();
      
      fr.onload = function(e) { 
        var result = JSON.parse(e.target.result);
        //Now update annotated stored in database
        // $rootScope.moviesEvaluation = $scope.objToStrMap(result);
        $scope.updateAnnotatedMovies(result);
      };
      
      fr.readAsText(files.item(0));
    };


    /**
	   * Send the new movies annotated to the server to update it
	   * @param {[type]}
	   */
	  $scope.updateAnnotatedMovies = function(movies) {
	  	$scope.showLoadingBar();
	  	console.log(movies);
	  	UpdateAnnotatedMoviesFactory.updateAnnotatedMovies(movies,
        function(movies) {
        	$rootScope.moviesEvaluation = $scope.objToStrMap(movies.movies);
        	console.log("Movies imported successfully!", $rootScope.moviesEvaluation);
					$scope.hideLoadingBar();
          //Staffing refresh
        }, function() {
          console.log('Movies update failed!');
          $scope.hideLoadingBar();
        }
      );

	  };

		/**
		* delete $localStorage.allMoviesInfos
		* @return {[type]} [description]
		*/
		$scope.deleteLocalStorage = function() {
			delete $localStorage.allMoviesInfos;
			console.log($localStorage.allMoviesInfos);
		};

  }]);
