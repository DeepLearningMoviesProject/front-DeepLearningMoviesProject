'use strict';

describe('Service: DeepMoviesApiFactories', function () {

  // load the service's module
  beforeEach(module('frontMoviesDeepLearningApp'));

  // instantiate service
  var DeepMoviesApiFactories;
  beforeEach(inject(function (_DeepMoviesApiFactories_) {
    DeepMoviesApiFactories = _DeepMoviesApiFactories_;
  }));

  it('should do something', function () {
    expect(!!DeepMoviesApiFactories).toBe(true);
  });

});
