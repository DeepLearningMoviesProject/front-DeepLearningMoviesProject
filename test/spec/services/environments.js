'use strict';

describe('Service: Environments', function () {

  // load the service's module
  beforeEach(module('frontMoviesDeepLearningApp'));

  // instantiate service
  var Environments;
  beforeEach(inject(function (_Environments_) {
    Environments = _Environments_;
  }));

  it('should do something', function () {
    expect(!!Environments).toBe(true);
  });

});
