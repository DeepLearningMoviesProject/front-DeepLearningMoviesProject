'use strict';

/**
 * @ngdoc function
 * @name frontMoviesDeepLearningApp.controller:AnnotatedmoviesCtrl
 * @description
 * # AnnotatedmoviesCtrl
 * Controller of the frontMoviesDeepLearningApp
 */
angular.module('frontMoviesDeepLearningApp')
  .controller('AnnotatedmoviesCtrl', ['$rootScope', '$scope', '$localStorage', '$timeout', 'MoviesDetailsFactory', function ($rootScope, $scope,$localStorage, $timeout, MoviesDetailsFactory) {
    
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
     * @param  {[type]} movie_id [description]
     * @return {[type]}          [description]
     */
    $scope.getMovieDetailsById = function(movie_id) {
      MoviesDetailsFactory.getMoviesDetailsById({id: movie_id}, function (movie){
        movie.$promise.then(function(movie) {
        	// console.log(movie);
        	$localStorage.allMoviesInfos[movie_id] = movie;
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
        		console.log($scope.allMoviesTemp);
        		$scope.allMovies = $scope.allMoviesTemp.slice();
        	}
          return movie;
          //Hide the loading bar when the data are available
          //$scope.hideLoadingBar();
        });
      });
    };


    $scope.getMovieDetailsByIdFromLS = function(movie_id) {
    	var movie = $localStorage.allMoviesInfos[movie_id];
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
    		$scope.allMovies = null;
    		$scope.allMovies = $scope.allMoviesTemp.slice();
    	}
      return movie;
    };

    //$scope.getMovieDetailsById("11");

  //   $scope.moviesEvaluation.forEach(function(valeur, clé) {
  //   	console.log(clé + " = " + valeur);
		// 	$scope.getMovieDetailsById(clé);
		// });



		/**
		 * Get next page of the annotated movies of an user (get movies informations of a page)
		 * @param  {[type]} firstIndex [description]
		 * @return {[type]}            [description]
		 */
		$scope.getNextMovies = function(firstIndex) {
			if ($scope.moviesEvaluation.size === 0) {
				return;
			}

			var cpt = 0;

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
				if ($localStorage.allMoviesInfos[iterArray[i]]) {
					$scope.getMovieDetailsByIdFromLS(iterArray[i]);
					// console.log("retrieve from LS", $localStorage.allMoviesInfos[iterArray[i]]);
				} else {
					// $scope.getMovieDetailsByIdFromLS(iterArray[i]);

					var waitTime = 275*cpt;
					(function(iterArray, i){  // i will now become available for the someMethod to call
			      $timeout(function() {
			        $scope.getMovieDetailsById(iterArray[i]);
						  // console.log("waitTime",waitTime);
			      }, waitTime);
			    })(iterArray, i);
			  	cpt++;
				}
			}

		};

		//$scope.getNextMovies(0);

		/**
		 * Get informations of all annotated movies of an user
		 * @param  {[type]} firstIndex [description]
		 * @return {[type]}            [description]
		 */
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
