'use strict';

describe('Controller: ImproveaccuracyCtrl', function () {

  // load the controller's module
  beforeEach(module('frontMoviesDeepLearningApp'));

  var ImproveaccuracyCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ImproveaccuracyCtrl = $controller('ImproveaccuracyCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ImproveaccuracyCtrl.awesomeThings.length).toBe(3);
  });
});
