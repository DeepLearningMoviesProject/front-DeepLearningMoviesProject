'use strict';

describe('Controller: RecommendationsCtrl', function () {

  // load the controller's module
  beforeEach(module('frontMoviesDeepLearningApp'));

  var RecommendationsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecommendationsCtrl = $controller('RecommendationsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecommendationsCtrl.awesomeThings.length).toBe(3);
  });
});
