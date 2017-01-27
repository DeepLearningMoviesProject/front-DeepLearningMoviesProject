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
        levelTechnos: {
          add:'/levelTechnos'
        },
        technos: {
            get:'/technos'
        },
        login: {
            login:'/login',
            logout:'/logout'
        },
        assignments: {
            staffing:'/assignments/details',
            assigns:'/assignments',
            update:'/assignments/:id',
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
            user:'/user'

        }
    };

    this.getWebserviceGroup = function() {
        var globalE = Environments.getEnvironment();
        var webs = angular.copy(webservicesList);
        for(var i in webs) {
            for(var key in webs[i]) {
                webs[i][key] = globalE + webs[i][key];
            }
        }
        return webs;
    };

    this.webServicesGroup = self.getWebserviceGroup();
});
