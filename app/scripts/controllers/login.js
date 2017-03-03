'use strict';

/**
 * @ngdoc function
 * @name frontMoviesDeepLearningApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the frontMoviesDeepLearningApp
 */
angular.module('frontMoviesDeepLearningApp')
  .controller('LoginCtrl', ['$scope', '$rootScope', '$mdSidenav', '$location', '$auth', function ($scope, $rootScope, $mdSidenav, $location, $auth) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.loginFunction = function() {
      $auth.login({name: $scope.user.name, password: $scope.user.password})
        .then(function(data) {
          console.log('You have successfully signed in!');
          $rootScope.moviesEvaluation = $scope.objToStrMap(data.data.movies);
          console.log("Movies imported successfully!", $rootScope.moviesEvaluation);
          $location.path('/');
        })
        .catch(function(error) {
          console.log(error.data.message, error.status);
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          console.log('You have successfully signed in with ' + provider + '!');
          $location.path('/');
        })
        .catch(function(error) {
          if (error.message) {
            // Satellizer promise reject error.
            console.log(error.message);
          } else if (error.data) {
            // HTTP response error from server
            console.log(error.data.message, error.status);
          } else {
            console.log(error);
          }
        });
    };

  }]);
