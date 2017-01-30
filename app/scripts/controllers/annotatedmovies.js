'use strict';

/**
 * @ngdoc function
 * @name frontMoviesDeepLearningApp.controller:AnnotatedmoviesCtrl
 * @description
 * # AnnotatedmoviesCtrl
 * Controller of the frontMoviesDeepLearningApp
 */
angular.module('frontMoviesDeepLearningApp')
  .controller('AnnotatedmoviesCtrl', ['$rootScope', '$scope', 'MoviesDetailsFactory', function ($rootScope, $scope, MoviesDetailsFactory) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    console.log($scope.moviesEvaluation);

    $scope.likedMovies = [];
    $scope.dislikedMovies = [];


    /**
     * Get details of a movie identified by its id
     */
    $scope.getMovieDetailsById = function(movie_id) {
      MoviesDetailsFactory.getMoviesDetailsById({id: movie_id}, function (movie){
        movie.$promise.then(function(movie) {
        	console.log(movie);
        	if ($scope.moviesEvaluation.get(movie_id) === 0) {
        		$scope.dislikedMovies.push(movie);
        	} else if ($scope.moviesEvaluation.get(movie_id) === 1) {
        		$scope.likedMovies.push(movie);
        	}
          return movie;
          //Hide the loading bar when the data are available
          //$scope.hideLoadingBar();
        });
      });
    };

    //$scope.getMovieDetailsById("11");

  //   $scope.moviesEvaluation.forEach(function(valeur, clé) {
  //   	console.log(clé + " = " + valeur);
		// 	$scope.getMovieDetailsById(clé);
		// });



		$scope.getNextMovies = function(firstIndex) {
			var rangeIndex = 40;
			var iterArray = Array.from($scope.moviesEvaluation.keys());	//Array containing the key of the moviesEvaluation map
			var lastIndex = firstIndex;
			if (firstIndex + rangeIndex > iterArray.length) {
				lastIndex = iterArray.length
			} else {
				lastIndex = firstIndex + rangeIndex;
			}

			for (var i = firstIndex; i < lastIndex; i++) {
				$scope.getMovieDetailsById(iterArray[i]);
			}

			if (lastIndex < iterArray.length) {
				setTimeout(function(){
				  $scope.getNextMovies(lastIndex);
				}, 11000);
			}

		}

		$scope.getNextMovies(0);
		// console.log($scope.moviesEvaluation.entries[0]);

  }]);
