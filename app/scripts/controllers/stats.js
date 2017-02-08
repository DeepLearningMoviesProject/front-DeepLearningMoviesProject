'use strict';

/**
 * @ngdoc function
 * @name frontMoviesDeepLearningApp.controller:StatsCtrl
 * @description
 * # StatsCtrl
 * Controller of the frontMoviesDeepLearningApp
 */
angular.module('frontMoviesDeepLearningApp')
  .controller('StatsCtrl', ['$rootScope','$scope', '$mdDialog', '$timeout', 'SearchMoviesFactory', 'DiscoverMoviesFactory', 'MoviesDetailsFactory', function ($rootScope, $scope, $mdDialog, $timeout, SearchMoviesFactory, DiscoverMoviesFactory, MoviesDetailsFactory) {

    $scope.likedMovies = [];
    $scope.dislikedMovies = [];
    $scope.allMoviesTemp = [];
    $scope.allMovies = [];
    $scope.genresStatsLiked = new Map();
    $scope.genresStatsDisliked = new Map();
    $scope.rangeIndex = 40;

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

    function initGenresStats() {
    	for (var i = 0; i < $scope.genres.length; i++) {
    		$scope.genresStatsDisliked.set($scope.genres[i].id, 0);
    		$scope.genresStatsLiked.set($scope.genres[i].id, 0);
    	}
    }

    function extractGenresStats() {
    	for (var i = 0; i < $scope.likedMovies.length; i++) {
    		console.log("extractGenresStats: ", i/($scope.allMovies.length-1)*100 + "%");
    		for (var j = 0; j < $scope.likedMovies[i].genres.length; j++) {
    			var temp = $scope.genresStatsLiked.get($scope.likedMovies[i].genres[j].id)+1;
    			$scope.genresStatsLiked.set($scope.likedMovies[i].genres[j].id, temp);	
    		}
    	}

    	for (var i = 0; i < $scope.dislikedMovies.length; i++) {
    		console.log("extractGenresStats: ", (i+$scope.likedMovies.length)/($scope.allMovies.length-1)*100 + "%");
    		for (var j = 0; j < $scope.dislikedMovies[i].genres.length; j++) {
    			var temp = $scope.genresStatsDisliked.get($scope.dislikedMovies[i].genres[j].id)+1;
    			$scope.genresStatsDisliked.set($scope.dislikedMovies[i].genres[j].id, temp);	
    		}
    	}
    }

    $scope.getAllMovies = function(firstIndex) {
			var iterArray = Array.from($scope.moviesEvaluation.keys());	//Array containing the key of the moviesEvaluation map
			var lastIndex = firstIndex;

			if (firstIndex + $scope.rangeIndex > iterArray.length) {
				lastIndex = iterArray.length;
			} else {
				lastIndex = firstIndex + $scope.rangeIndex;
			}

			for (var i = firstIndex; i < lastIndex; i++) {
				console.log("getAllMovies: ", i/($scope.moviesEvaluation.size-1)*100 + "%");
				$scope.getMovieDetailsById(iterArray[i]);
			}

			if (lastIndex < iterArray.length) {
				setTimeout(function(){
				  $scope.getAllMovies(lastIndex);
				}, 11000);
			}
		};

		initGenresStats();
		$scope.getAllMovies(0);

  }]);
