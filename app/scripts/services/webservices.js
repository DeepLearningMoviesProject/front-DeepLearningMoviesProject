'use strict';

/**
 * @ngdoc service
 * @name frontMoviesDeepLearningApp.WebServices
 * @description
 * # WebServices
 * Service in the frontMoviesDeepLearningApp.
 */
angular.module('frontMoviesDeepLearningApp')
  .service('WebServices', function Webservices(Environments) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var self = this;

    var tmdbRequest = ["movies", "search", "discover"];

    var webservicesList = {
        movies: {
					getDetails:'/movie/:id',
					getCredits:'/movie/:id/credits',
					getKeywords:'/movie/:id/keywords',
					getLatest:'/movie/latest',
					getPopular:'/movie/popular'
        },
        search: {
          movies:'/search/movie',
          keywords:'/search/keyword',
          multi:'/search/multi'
        },
        discover: {
          movies:'/discover/movie'
        },
        login: {
            login:'/login',
            logout:'/logout',
            signup:'/signup'
        },
        deepMovies: {
            updateMovies:'/api/updateMovies',
            getLikedMovies:'/api/likedMovies/liked',
            getDisikedMovies:'/api/likedMovies/disliked',
            getAllMovies:'/api/likedMovies/all',
            updateMovie:'/api/likedMovie/:id/:liked',
            createMovie:'/api/likedMovie/:id/:liked',
            deleteMovie:'/api/likedMovie/:id',
            delete:'/assignments/:id',
            projectDefault: '/assignments/projects/:id',
            projectFromWeek: '/assignments/projects/:id/:week,:year',
            firstLastProject: '/assignments/projects/:id/assignments?positions=first,last',
            lastProject: '/assignments/projects/:id/assignments?positions=last',
            collabDefault: '/assignments/collabs/:id',
            collabFromWeek: '/assignments/collabs/:id/:week,:year'
        },
        users: {
            add:'/users/add',
            delete:'/users/:id',
            list:'/users',
            user:'/user',
            testId:'/testId'

        }
    };

    this.getWebserviceGroup = function() {
        var globalTMDBEnv = Environments.getTMDBEnvironment();
        var globalEnv = Environments.getBackEndEnvironment();
        var webs = angular.copy(webservicesList);
        for(var i in webs) {
            for(var key in webs[i]) {
                if (tmdbRequest.includes(i)) {
                    webs[i][key] = globalTMDBEnv + webs[i][key];
                } else {
                    webs[i][key] = globalEnv + webs[i][key];
                }
            }
        }
        return webs;
    };

    this.webServicesGroup = self.getWebserviceGroup();
});
