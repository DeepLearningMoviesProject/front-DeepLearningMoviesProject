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
    
    console.log($scope.moviesEvaluation);

    var lastIndexToLoad = 0;

    $scope.likedMovies = [];
    $scope.dislikedMovies = [];
    $scope.allMoviesTemp = [];
    $scope.allMovies = [];

    $scope.rangeIndex = 14;
    $scope.paging = {
        total: Math.ceil($scope.moviesEvaluation.size/$scope.rangeIndex),
        current: 1
    };

    $scope.$on('SUCCESS', function() {
      console.log('ALL PICTURES LOADED SUCCESSFULLY');
    });

    $scope.$on('FAIL', function() {
      console.log('ALL PICTURES LOADED WITH ATLEAST ONE FAILED');
    });

    $scope.$on('ALWAYS', function() {
      $scope.hideLoadingBar();
      console.log('ALL DONE ALWAYS');        
    });


    /**
     * Get details of a movie identified by its id
     */
    $scope.getMovieDetailsById = function(movie_id) {
      MoviesDetailsFactory.getMoviesDetailsById({id: movie_id}, function (movie){
        movie.$promise.then(function(movie) {
        	// console.log(movie);
        	$scope.allMoviesTemp.push(movie);
        	if ($scope.moviesEvaluation.get(movie_id) === 0) {
        		$scope.dislikedMovies.push(movie);
        	} else if ($scope.moviesEvaluation.get(movie_id) === 1) {
        		$scope.likedMovies.push(movie);
        	}

        	// console.log("getMovieDetailsById lastIndexToLoad: ", (lastIndexToLoad - (($scope.paging.current-1)*$scope.rangeIndex)));

        	//When all movies of the page have been added to allMoviesTemp, slice it to allMovie to allow movie display
        	//lastIndexToLoad - (($scope.paging.current-1)*$scope.rangeIndex) = how many movies for the current page have to be loaded
        	if ($scope.allMoviesTemp.length === lastIndexToLoad - (($scope.paging.current-1)*$scope.rangeIndex)) {
        		$scope.allMovies = $scope.allMoviesTemp.slice();
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
			if ($scope.moviesEvaluation.size === 0) {
				return;
			}
			$scope.showLoadingBar();
			var iterArray = Array.from($scope.moviesEvaluation.keys());	//Array containing the key of the moviesEvaluation map
			var lastIndex = firstIndex;
			if (firstIndex + $scope.rangeIndex > iterArray.length) {
				lastIndex = iterArray.length;
			} else {
				lastIndex = firstIndex + $scope.rangeIndex;
			}

			//Needed to know how many movies have to be loaded for the current page and display movie cards only when 
			//all pictures have been loaded
			lastIndexToLoad = lastIndex;
			// console.log("getNextMovies lastIndexToLoad: " + lastIndexToLoad);
			$scope.allMoviesTemp = [];
			$scope.allMovies = [];
			for (var i = firstIndex; i < lastIndex; i++) {
				$scope.getMovieDetailsById(iterArray[i]);
			}

		};

		//$scope.getNextMovies(0);

		$scope.getAllMovies = function(firstIndex) {
			var iterArray = Array.from($scope.moviesEvaluation.keys());	//Array containing the key of the moviesEvaluation map
			var lastIndex = firstIndex;
			if (firstIndex + $scope.rangeIndex > iterArray.length) {
				lastIndex = iterArray.length;
			} else {
				lastIndex = firstIndex + $scope.rangeIndex;
			}

			for (var i = firstIndex; i < lastIndex; i++) {
				$scope.getMovieDetailsById(iterArray[i]);
			}

			if (lastIndex < iterArray.length) {
				setTimeout(function(){
				  $scope.getNextMovies(lastIndex);
				}, 11000);
			}
		};

		//$scope.getAllMovies(0);
		// console.log($scope.moviesEvaluation.entries[0]);

  }]);
