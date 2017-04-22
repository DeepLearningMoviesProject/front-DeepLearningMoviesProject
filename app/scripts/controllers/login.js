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

    $scope.loginFailed = false;

    /**
     * The login function
     * @return {[type]} [description]
     */
    $scope.loginFunction = function() {
      console.log("login function");
      $scope.showLoadingBar();
      $scope.loginFailed = false;
      $auth.login({name: $scope.user.name, password: $scope.user.password})
        .then(function(data) {
          console.log('You have successfully signed in!');
          console.log(data);
          $rootScope.userInfo = {};
          $rootScope.userInfo.name = data.data.name;
          $rootScope.userInfo.email = data.data.email;
          $rootScope.moviesEvaluation = $scope.objToStrMap(data.data.movies);
          console.log("Movies imported successfully!", $rootScope.moviesEvaluation);
          $scope.hideLoadingBar();
          $location.path('/');
        })
        .catch(function(error) {
          $scope.hideLoadingBar();
          $scope.loginFailed = true;
          console.log(error.data.message, error.status);
        });
    };

    /**
     * Authenticate with a provider (facebook, google, twitter...)
     * @param  {[type]} provider [description]
     * @return {[type]}          [description]
     */
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
