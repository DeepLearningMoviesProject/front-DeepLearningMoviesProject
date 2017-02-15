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
    $scope.genresStatsDisliked = new Map();
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
    $scope.yearLikedStats = {
    	average: 0,
    	median: 0,
    	firstQuart: 0,
    	thirdQuart: 0,
    	years: []
    };
    $scope.yearDislikedStats = {
    	average: 0,
    	median: 0,
    	firstQuart: 0,
    	thirdQuart: 0,
    	years: []
    };
    $scope.voteLikedStats = {
    	average: 0,
    	median: 0,
    	firstQuart: 0,
    	thirdQuart: 0,
    	votes: []
    };
    $scope.voteDislikedStats = {
    	average: 0,
    	median: 0,
    	firstQuart: 0,
    	thirdQuart: 0,
    	votes: []
    };
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
    	if(values.length % 2) {
    		return values[half];
    	}
    	else {
    		return (values[half-1] + values[half]) / 2.0;
    	}
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
        		extractStats();
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
    		extractStats();
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
    function extractStats() {
    	//Bar graph variables
    	var likedGenreData = [];
			var dislikedGenreData = [];

    	//Liked movies loop
    	for (var i = 0; i < $scope.likedMovies.length; i++) {
    		console.log("extractStats: ", i/($scope.allMovies.length-1)*100 + "%");
    		$scope.loadingProcessing = i/($scope.allMovies.length-1)*100;
    		//runtime stats
    		$scope.runtimeLikedStats.average += $scope.likedMovies[i].runtime;
    		$scope.runtimeLikedStats.runtimes.push($scope.likedMovies[i].runtime);
    		//Year stats
    		$scope.yearLikedStats.average += parseInt($scope.likedMovies[i].release_date);
    		$scope.yearLikedStats.years.push(parseInt($scope.likedMovies[i].release_date));
    		//vote stats
    		$scope.voteLikedStats.average += $scope.likedMovies[i].vote_average;
    		$scope.voteLikedStats.votes.push($scope.likedMovies[i].vote_average);
    		//Iterate through genres of a movie
    		for (var j = 0; j < $scope.likedMovies[i].genres.length; j++) {
    			var temp = $scope.genresStatsLiked.get($scope.likedMovies[i].genres[j].id)+1;
    			$scope.genresStatsLiked.set($scope.likedMovies[i].genres[j].id, temp);	
    		}
    	}

    	//Disliked movies loop
    	for (var k = 0; k < $scope.dislikedMovies.length; k++) {
    		console.log("extractStats: ", (k+$scope.likedMovies.length)/($scope.allMovies.length-1)*100 + "%");
    		$scope.loadingProcessing = (k+$scope.likedMovies.length)/($scope.allMovies.length-1)*100;
    		//runtime stats
    		$scope.runtimeDislikedStats.average += $scope.dislikedMovies[k].runtime;
    		$scope.runtimeDislikedStats.runtimes.push($scope.dislikedMovies[k].runtime);
    		//Year stats
    		$scope.yearDislikedStats.average += parseInt($scope.dislikedMovies[k].release_date);
    		$scope.yearDislikedStats.years.push(parseInt($scope.dislikedMovies[k].release_date));
    		//vote stats
    		$scope.voteDislikedStats.average += $scope.dislikedMovies[k].vote_average;
    		$scope.voteDislikedStats.votes.push($scope.dislikedMovies[k].vote_average);
    		//Iterate through genres of a movie
    		for (var l = 0; l < $scope.dislikedMovies[k].genres.length; l++) {
    			var temp2 = $scope.genresStatsDisliked.get($scope.dislikedMovies[k].genres[l].id)+1;
    			$scope.genresStatsDisliked.set($scope.dislikedMovies[k].genres[l].id, temp2);	
    		}
    	}

    	//Bar graph data processing
      for (var m = 0; m < $scope.genres.length; m++) {
        //Labels creation: Genres names
        $scope.labelsBarGraph[m] = $scope.genres[m].name;
        likedGenreData.push(($scope.genresStatsLiked.get($scope.genres[m].id)/$scope.likedMovies.length)*100);
        dislikedGenreData.push(($scope.genresStatsDisliked.get($scope.genres[m].id)/$scope.dislikedMovies.length)*100);
      }

    	$scope.dataBarGraph.push(likedGenreData, dislikedGenreData);

    	//compute average and median runtime for both liked and disliked movies
    	$scope.runtimeLikedStats.average = $scope.runtimeLikedStats.average/$scope.runtimeLikedStats.runtimes.length;
    	$scope.runtimeDislikedStats.average = $scope.runtimeDislikedStats.average/$scope.runtimeDislikedStats.runtimes.length;
    	$scope.runtimeLikedStats.median = median($scope.runtimeLikedStats.runtimes);
    	$scope.runtimeDislikedStats.median = median($scope.runtimeDislikedStats.runtimes);
    	//compute average and median year for both liked and disliked movies
    	$scope.yearLikedStats.average = $scope.yearLikedStats.average/$scope.yearLikedStats.years.length;
    	$scope.yearDislikedStats.average = $scope.yearDislikedStats.average/$scope.yearDislikedStats.years.length;
    	$scope.yearLikedStats.median = median($scope.yearLikedStats.years);
    	$scope.yearDislikedStats.median = median($scope.yearDislikedStats.years);
    	//compute average and median vote for both liked and disliked movies
    	$scope.voteLikedStats.average = $scope.voteLikedStats.average/$scope.voteLikedStats.votes.length;
    	$scope.voteDislikedStats.average = $scope.voteDislikedStats.average/$scope.voteDislikedStats.votes.length;
    	$scope.voteLikedStats.median = median($scope.voteLikedStats.votes);
    	$scope.voteDislikedStats.median = median($scope.voteDislikedStats.votes);
    	console.log($scope.runtimeLikedStats);
			console.log($scope.runtimeDislikedStats);
			console.log($scope.yearLikedStats);
			console.log($scope.yearDislikedStats);
			$scope.statsAvailable = true;
    }

    /**
     * Recover all informations of all annotated movies (recursive function)
     * DEPRECATED
     * @param  {[type]} firstIndex [description]
     * @return {[type]}            [description]
     */
    $scope.getAllMovies2 = function(firstIndex) {
			var iterArray = Array.from($scope.moviesEvaluation.keys());	//Array containing the key of the moviesEvaluation map
			var lastIndex = firstIndex;
			// var cpt = firstIndex + $scope.rangeIndex;
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


		$scope.getAllMovies = function() {
			var iterArray = Array.from($scope.moviesEvaluation.keys());	//Array containing the key of the moviesEvaluation map

			var cpt = 0;
			var loadingCpt = 0;

			for (var i = 0; i < iterArray.length; i++) {
				// console.log("getAllMovies: ", i/($scope.moviesEvaluation.size-1)*100 + "%");
				if ($localStorage.allMoviesInfos[iterArray[i]]) {
					$scope.getMovieDetailsByIdFromLS(iterArray[i]);
					// console.log("retrieve from LS", $localStorage.allMoviesInfos[iterArray[i]]);
					loadingCpt++;
					$scope.loadingTMDB = loadingCpt/($scope.moviesEvaluation.size-1)*100;
				} else {

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
				}
			}

			// console.log("temps attendu: ", waitTime);

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
		
		$scope.getAllMovies();

  }]);
