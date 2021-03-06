'use strict';

describe('Controller: PrimaryCtrl', function () {

  // load the controller's module
  beforeEach(module('frontMoviesDeepLearningApp'));

  var PrimaryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PrimaryCtrl = $controller('PrimaryCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PrimaryCtrl.awesomeThings.length).toBe(3);
  });
});
