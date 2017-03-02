'use strict';

/**
 * @ngdoc function
 * @name frontMoviesDeepLearningApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the frontMoviesDeepLearningApp
 */
angular.module('frontMoviesDeepLearningApp')
  .controller('SignupCtrl', ['$scope', '$rootScope', '$mdSidenav', '$location', '$auth', function ($scope, $rootScope, $mdSidenav, $location, $auth) {

  	$scope.user = {};
  	$scope.user.birthday = new Date();

  	var today = new Date();
		$scope.maxDate = new Date();

  	$scope.signupFunction = function() {
  		console.log("SignUp function");
      $auth.signup($scope.user)
        .then(function(response) {
          $auth.setToken(response);
          $location.path('/');
          console.log('You have successfully created a new account and have been signed-in');
        })
        .catch(function(response) {
          console.log(response.data.message);
        });
    };

    $scope.occupations = ["agriculteurs",
                   "artisan - commerçant - chef d\'entreprise",
                   "autres",
                   "cadre",
                   "employé",
                   "étudiant",
                   "ouvrier",
                   "profession intermédiaire",
                   "retraité"];
    
  	// $scope.signUp = function () {
	  //   $auth
	  //     .signup({email: $scope.email, password: $scope.password})
	  //     .then(function (response) {
	  //       $auth.setToken(response);
	  //       $state.go('secret');
	  //     })
	  //     .catch(function (response) {
	  //       console.log("error ", response);
	  //     });
	  // };

	  // $scope.login = function () {
	  //   $auth
	  //     .login({email: $scope.email, password: $scope.password})
	  //     .then(function (response) {
	  //       $auth.setToken(response);
	  //       $state.go('secret');
	  //     })
	  //     .catch(function (response) {
	  //       toastr.error(
	  //         'Email or password not correct!',
	  //         {closeButton: true}
	  //       );
	  //     });
	  // };

	  // $scope.auth = function (provider) {
	  //   $auth.authenticate(provider)
	  //     .then(function (response) {
	  //       console.debug("success", response);
	  //       $state.go('secret');
	  //     })
	  //     .catch(function (response) {
	  //       console.debug("catch", response);
	  //     });
	  // };

  }]);
