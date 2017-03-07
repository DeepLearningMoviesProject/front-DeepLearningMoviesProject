'use strict';

describe('Controller: CreditsCtrl', function () {

  // load the controller's module
  beforeEach(module('frontMoviesDeepLearningApp'));

  var CreditsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreditsCtrl = $controller('CreditsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CreditsCtrl.awesomeThings.length).toBe(3);
  });
});
