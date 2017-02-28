'use strict';

/**
 * @ngdoc overview
 * @name frontMoviesDeepLearningApp
 * @description
 * # frontMoviesDeepLearningApp
 *
 * Main module of the application.
 */
angular
  .module('frontMoviesDeepLearningApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngMaterial',
    'imagesLoaded',
    'cl.paging',
    'chart.js',
    'ngStorage'
  ])

  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/improveAccuracy', {
        templateUrl: 'views/improveaccuracy.html',
        controller: 'ImproveaccuracyCtrl',
        controllerAs: 'improveAccuracy'
      })
      .when('/annotatedMovies', {
        templateUrl: 'views/annotatedmovies.html',
        controller: 'AnnotatedmoviesCtrl',
        controllerAs: 'annotatedMovies'
      })
      .when('/stats', {
        templateUrl: 'views/stats.html',
        controller: 'StatsCtrl',
        controllerAs: 'stats'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/recommendations', {
        templateUrl: 'views/recommendations.html',
        controller: 'RecommendationsCtrl',
        controllerAs: 'recommendations'
      })
      .otherwise({
        redirectTo: '/'
      });
  })

  .config(['$localStorageProvider', function ($localStorageProvider) {
    $localStorageProvider.setKeyPrefix('deepMovies');
  }])


  .config(function ($httpProvider) {

    //enable CSRF
    // $httpProvider.defaults.xsrfCookieName = 'CSRF-TOKEN';
    // $httpProvider.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';
    // $httpProvider.defaults.withCredentials = true;
    // $httpProvider.defaults.headers.common["Accept"] = "application/json";
    // $httpProvider.defaults.headers.common["Content-Type"] = "application/json";

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    // $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    // $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
    // $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = 'x-requested-with';
  })

  .config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['**']);
  })

  .config(function($mdThemingProvider) {
    var customBlueMap =     $mdThemingProvider.extendPalette('light-blue', {
      'contrastDefaultColor': 'light',
      'contrastDarkColors': ['50'],
      '50': 'ffffff'
    });
    $mdThemingProvider.definePalette('customBlue', customBlueMap);
    // $mdThemingProvider.theme('default')
    //   .primaryPalette('customBlue', {
    //     'default': '500',
    //     'hue-1': '50'
    //   })
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('pink');
    $mdThemingProvider.theme('greenTheme')
      .primaryPalette('green');
    $mdThemingProvider.theme('redTheme')
      .primaryPalette('red');
    $mdThemingProvider.theme('input', 'default')
      .primaryPalette('grey');
    $mdThemingProvider.alwaysWatchTheme(true);
  })

  .config(function($mdIconProvider) {
    $mdIconProvider
      // linking to https://github.com/google/material-design-icons/tree/master/sprites/svg-sprite
      //
      // .iconSet('action', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-action.svg', 24)
      .iconSet('action', 'material-design-icons/sprites/svg-sprite/svg-sprite-action.svg', 24)
      .iconSet('home', 'material-design-icons/sprites/svg-sprite/svg-sprite-home.svg', 24)
      .iconSet('alert', 'material-design-icons/sprites/svg-sprite/svg-sprite-alert.svg', 24)
      .iconSet('av', 'material-design-icons/sprites/svg-sprite/svg-sprite-av.svg', 24)
      .iconSet('communication', 'material-design-icons/sprites/svg-sprite/svg-sprite-communication.svg', 24)
      .iconSet('content', 'material-design-icons/sprites/svg-sprite/svg-sprite-content.svg', 24)
      .iconSet('device', 'material-design-icons/sprites/svg-sprite/svg-sprite-device.svg', 24)
      .iconSet('editor', 'material-design-icons/sprites/svg-sprite/svg-sprite-editor.svg', 24)
      .iconSet('file', 'material-design-icons/sprites/svg-sprite/svg-sprite-file.svg', 24)
      .iconSet('hardware', 'material-design-icons/sprites/svg-sprite/svg-sprite-hardware.svg', 24)
      .iconSet('image', 'material-design-icons/sprites/svg-sprite/svg-sprite-image.svg', 24)
      .iconSet('maps', 'material-design-icons/sprites/svg-sprite/svg-sprite-maps.svg', 24)
      .iconSet('navigation', 'material-design-icons/sprites/svg-sprite/svg-sprite-navigation.svg', 24)
      .iconSet('notification', 'material-design-icons/sprites/svg-sprite/svg-sprite-notification.svg', 24)
      .iconSet('social', 'material-design-icons/sprites/svg-sprite/svg-sprite-social.svg', 24)
      .iconSet('toggle', 'material-design-icons/sprites/svg-sprite/svg-sprite-toggle.svg', 24)

      // Illustrated user icons used in the docs https://material.angularjs.org/latest/#/demo/material.components.gridList
      .iconSet('avatars', 'https://raw.githubusercontent.com/angular/material/master/docs/app/icons/avatar-icons.svg', 24)
      .defaultIconSet('material-design-icons/sprites/svg-sprite/svg-sprite-action.svg', 24);
  });
