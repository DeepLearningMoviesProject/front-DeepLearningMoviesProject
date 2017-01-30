'use strict';

describe('Controller: AnnotatedmoviesCtrl', function () {

  // load the controller's module
  beforeEach(module('frontMoviesDeepLearningApp'));

  var AnnotatedmoviesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AnnotatedmoviesCtrl = $controller('AnnotatedmoviesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AnnotatedmoviesCtrl.awesomeThings.length).toBe(3);
  });
});
