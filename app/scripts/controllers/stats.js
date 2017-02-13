'use strict';

/**
 * @ngdoc function
 * @name frontMoviesDeepLearningApp.controller:StatsCtrl
 * @description
 * # StatsCtrl
 * Controller of the frontMoviesDeepLearningApp
 */
angular.module('frontMoviesDeepLearningApp')
  .controller('StatsCtrl', ['$rootScope','$scope', '$mdDialog', '$timeout', '$interval', '$localStorage', 'SearchMoviesFactory', 'DiscoverMoviesFactory', 'MoviesDetailsFactory', function ($rootScope, $scope, $mdDialog, $timeout, $interval, $localStorage, SearchMoviesFactory, DiscoverMoviesFactory, MoviesDetailsFactory) {

    $scope.likedMovies = [];
    $scope.dislikedMovies = [];
    $scope.allMoviesTemp = [];
    $scope.allMovies = [];
    $scope.stats = {};
    $scope.genresStatsLiked = new Map();
    $scope.loadingTMDB = 0;
    $scope.loadingProcessing = 0;
    $scope.statsAvailable = false;
    $scope.runtimeLikedStats = {
    	average: 0,
    	median: 0,
    	firstQuart: 0,
    	thirdQuart: 0,
    	runtimes: []
    };
    $scope.runtimeDislikedStats = {
    	average: 0,
    	median: 0,
    	firstQuart: 0,
    	thirdQuart: 0,
    	runtimes: []
    };
    $scope.genresStatsDisliked = new Map();
    $scope.rangeIndex = 35;

    //Graphe variables
    $scope.series = ['👍', '👎'];
	  $scope.dataBarGraph = [];
	  $scope.labelsBarGraph = [];


	  //If localStorage variables aren't already created, create them 
	  if (!$localStorage.allMoviesInfos) {
	  	$localStorage.allMoviesInfos = {};
	  }

	  // delete $localStorage.allMoviesInfos;
	  // 
	  $scope.deleteLS = function() {
	  	delete $localStorage.allMoviesInfos;
	  	console.log($localStorage.allMoviesInfos);
	  };

	  /**
	   * A Javascript object with every genres availaible on TMDB
	   * @type {Array}
	   */
    $scope.genres = [
    {
    	id: 28,
    	name: "Action"
    },
    {
    	id: 12,
    	name: "Aventure"
    },
    {
    	id: 16,
    	name: "Animation"
    },
    {
    	id: 35,
    	name: "Comédie"
    },
    {
    	id: 80,
    	name: "Crime"
    },
    {
    	id: 99,
    	name: "Documentaire"
    },
    {
    	id: 18,
    	name: "Drame"
    },
    {
    	id: 10751,
    	name: "Familial"
    },
    {
    	id: 14,
    	name: "Fantastique"
    },
    {
    	id: 36,
    	name: "Histoire"
    },
    {
    	id: 27,
    	name: "Horreur"
    },
    {
    	id: 10402,
    	name: "Musique"
    },
    {
    	id: 9648,
    	name: "Mystère"
    },
    {
    	id: 10749,
    	name: "Romance"
    },
    {
    	id: 878,
    	name: "Science-Fiction"
    },
    {
    	id: 10770,
    	name: "Téléfilm"
    },
    {
    	id: 53,
    	name: "Thriller"
    },
    {
    	id: 10752,
    	name: "Guerre"
    },
    {
    	id: 37,
    	name: "Western"
    },
    {
    	id: 10769,
    	name: "Étranger"
    }
    ];

    console.log($scope.genres);

    /**
     * Compute the median of an array
     * @param  {[type]} values [description]
     * @return {[type]}        [description]
     */
    function median(values) {
    	values.sort(function(a,b) {return a - b;} );
    	var half = Math.floor(values.length/2);
    	if(values.length % 2)
    		return values[half];
    	else
    		return (values[half-1] + values[half]) / 2.0;
    }


    /**
     * Get details of a movie identified by its id
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

        	//When all movies have been added to allMoviesTemp, slice it to allMovie to start statistiques extraction
        	if ($scope.allMoviesTemp.length === $scope.moviesEvaluation.size) {
        		$scope.allMovies = $scope.allMoviesTemp.slice();
        		extractGenresStats();
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

    	//When all movies have been added to allMoviesTemp, slice it to allMovie to start statistiques extraction
    	if ($scope.allMoviesTemp.length === $scope.moviesEvaluation.size) {
    		$scope.allMovies = $scope.allMoviesTemp.slice();
    		extractGenresStats();
    	}
      return movie;
    };

    /**
     * Init statistics on genres (init importants variables)
     * @return {[type]} [description]
     */
    function initGenresStats() {
    	for (var i = 0; i < $scope.genres.length; i++) {
    		$scope.genresStatsDisliked.set($scope.genres[i].id, 0);
    		$scope.genresStatsLiked.set($scope.genres[i].id, 0);
    	}
    }

    /**
     * Extract statistics from annotated movies
     * @return {[type]} [description]
     */
    function extractGenresStats() {
    	//Bar graph variables
    	var likedGenreData = [];
			var dislikedGenreData = [];

    	//Liked movies loop
    	for (var i = 0; i < $scope.likedMovies.length; i++) {
    		console.log("extractGenresStats: ", i/($scope.allMovies.length-1)*100 + "%");
    		$scope.loadingProcessing = i/($scope.allMovies.length-1)*100;
    		$scope.runtimeLikedStats.average += $scope.likedMovies[i].runtime;
    		$scope.runtimeLikedStats.runtimes.push($scope.likedMovies[i].runtime);
    		for (var j = 0; j < $scope.likedMovies[i].genres.length; j++) {
    			var temp = $scope.genresStatsLiked.get($scope.likedMovies[i].genres[j].id)+1;
    			$scope.genresStatsLiked.set($scope.likedMovies[i].genres[j].id, temp);	
    		}
    	}

    	//Disliked movies loop
    	for (var i = 0; i < $scope.dislikedMovies.length; i++) {
    		console.log("extractGenresStats: ", (i+$scope.likedMovies.length)/($scope.allMovies.length-1)*100 + "%");
    		$scope.loadingProcessing = (i+$scope.likedMovies.length)/($scope.allMovies.length-1)*100;
    		$scope.runtimeDislikedStats.average += $scope.dislikedMovies[i].runtime;
    		$scope.runtimeDislikedStats.runtimes.push($scope.dislikedMovies[i].runtime);
    		for (var j = 0; j < $scope.dislikedMovies[i].genres.length; j++) {
    			var temp = $scope.genresStatsDisliked.get($scope.dislikedMovies[i].genres[j].id)+1;
    			$scope.genresStatsDisliked.set($scope.dislikedMovies[i].genres[j].id, temp);	
    		}
    	}

    	//Bar graph data processing
    	for (var i = 0; i < $scope.genres.length; i++) {
    		//Labels creation: Genres names
    		$scope.labelsBarGraph[i] = $scope.genres[i].name;
    		likedGenreData.push(($scope.genresStatsLiked.get($scope.genres[i].id)/$scope.likedMovies.length)*100);
    		dislikedGenreData.push(($scope.genresStatsDisliked.get($scope.genres[i].id)/$scope.dislikedMovies.length)*100);
    	}

    	$scope.dataBarGraph.push(likedGenreData, dislikedGenreData);

    	$scope.runtimeLikedStats.average = $scope.runtimeLikedStats.average/$scope.likedMovies.length;
    	$scope.runtimeDislikedStats.average = $scope.runtimeDislikedStats.average/$scope.dislikedMovies.length;
    	$scope.runtimeLikedStats.median = median($scope.runtimeLikedStats.runtimes);
    	$scope.runtimeDislikedStats.median = median($scope.runtimeDislikedStats.runtimes);
    	console.log($scope.runtimeLikedStats);
			console.log($scope.runtimeDislikedStats);
			$scope.statsAvailable = true;
    }

    /**
     * Recover all informations of all annotated movies (recursive function)
     * @param  {[type]} firstIndex [description]
     * @return {[type]}            [description]
     */
    $scope.getAllMovies = function(firstIndex) {
			var iterArray = Array.from($scope.moviesEvaluation.keys());	//Array containing the key of the moviesEvaluation map
			var lastIndex = firstIndex;
			var cpt = firstIndex + $scope.rangeIndex;
			var cptMovieInCache = 0;

			if (firstIndex + $scope.rangeIndex > iterArray.length) {
				lastIndex = iterArray.length;
			} else {
				lastIndex = firstIndex + $scope.rangeIndex;
			}

			for (var i = firstIndex; i < lastIndex; i++) {
				// console.log("getAllMovies: ", i/($scope.moviesEvaluation.size-1)*100 + "%");
				$scope.loadingTMDB = i/($scope.moviesEvaluation.size-1)*100;
				if ($localStorage.allMoviesInfos[iterArray[i]]) {
					$scope.getMovieDetailsByIdFromLS(iterArray[i]);
					// console.log("retrieve from LS", $localStorage.allMoviesInfos[iterArray[i]]);
					cptMovieInCache++;
				} else {
					$scope.getMovieDetailsById(iterArray[i]);
				}
			}

			var timeoutNeeded = 11000-(250*cptMovieInCache);
			console.log("temps attendu: ", timeoutNeeded);
			console.log("temps gagné: ", 250*cptMovieInCache);

			// Increase loadingTMDB smoothly
			// $interval(function() {
			// 		cpt++;
			// 		$scope.loadingTMDB = cpt/($scope.moviesEvaluation.size-1)*100;
   //  	}, 11000/$scope.rangeIndex, lastIndex-firstIndex, true);

			if (lastIndex < iterArray.length) {
				$timeout(function(){
				  $scope.getAllMovies(lastIndex);
				}, timeoutNeeded);
			}
		};


		$scope.getAllMovies2 = function() {
			var iterArray = Array.from($scope.moviesEvaluation.keys());	//Array containing the key of the moviesEvaluation map

			var cpt = 0;
			var loadingCpt = 0;

			for (var i = 0; i < iterArray.length; i++) {
				// console.log("getAllMovies: ", i/($scope.moviesEvaluation.size-1)*100 + "%");
				if ($localStorage.allMoviesInfos[iterArray[i]]) {
					$scope.getMovieDetailsByIdFromLS(iterArray[i]);
					console.log("retrieve from LS", $localStorage.allMoviesInfos[iterArray[i]]);
					loadingCpt++;
					$scope.loadingTMDB = loadingCpt/($scope.moviesEvaluation.size-1)*100;
				} else {
					// $scope.getMovieDetailsById(iterArray[i]);
					
					
					var waitTime = 275*cpt;
					(function(iterArray, i){  // i will now become available for the someMethod to call
			      $timeout(function() {
			        $scope.getMovieDetailsById(iterArray[i]);
						  // console.log("waitTime",waitTime);
						  loadingCpt++;
							$scope.loadingTMDB = loadingCpt/($scope.moviesEvaluation.size-1)*100;
			      }, waitTime);
			    })(iterArray, i);
			  	cpt++;



					// (function(cpt){  // i will now become available for the someMethod to call
			  //     $timeout(function() {
			  //       $scope.getMovieDetailsById(iterArray[i]);
					// 	  console.log("cpt",cpt);
					// 	  cpt++;
			  //     }, 250*cpt);
			  //   })(cpt);

				}
			}

			console.log("temps attendu: ", waitTime);

			// Increase loadingTMDB smoothly
			// $interval(function() {
			// 		cpt++;
			// 		$scope.loadingTMDB = cpt/($scope.moviesEvaluation.size-1)*100;
   //  	}, 11000/$scope.rangeIndex, lastIndex-firstIndex, true);

		};


		initGenresStats();
		//Small timeout (5 seconds) before recovering all data from TMDB to prevent the request per second limit to be triggered
		//To be sure, the timeout should be of 10 seconds but 5 seems to be enough (we recover only 35 movies per 10 seconds but
		// 40 requests per 10 seconds are allowed)
		// var initCpt = 0
		// $interval(function() {
		// 		initCpt++;
		// 		$scope.loadingTMDB = initCpt/($scope.moviesEvaluation.size-1)*100;
  	// 	}, 5000/$scope.rangeIndex, $scope.rangeIndex, true);
		

		// $timeout(function(){
		//   $scope.getAllMovies(0);
		// }, 3000);
		// 
		
		$scope.getAllMovies2();

  }]);
