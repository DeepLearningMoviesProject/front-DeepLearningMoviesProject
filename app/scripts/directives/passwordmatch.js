'use strict';

/**
 * @ngdoc directive
 * @name frontMoviesDeepLearningApp.directive:passwordMatch
 * @description
 * # passwordMatch
 */
angular.module('frontMoviesDeepLearningApp')
  .directive('passwordMatch', function() {
    return {
      require: 'ngModel',
      scope: {
        otherModelValue: '=passwordMatch'
      },
      link: function(scope, element, attributes, ngModel) {
        ngModel.$validators.compareTo = function(modelValue) {
          return modelValue === scope.otherModelValue;
        };
        scope.$watch('otherModelValue', function() {
          ngModel.$validate();
        });
      }
    };
  });
