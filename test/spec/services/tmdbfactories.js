'use strict';

describe('Service: TMDBFactories', function () {

  // load the service's module
  beforeEach(module('frontMoviesDeepLearningApp'));

  // instantiate service
  var TMDBFactories;
  beforeEach(inject(function (_TMDBFactories_) {
    TMDBFactories = _TMDBFactories_;
  }));

  it('should do something', function () {
    expect(!!TMDBFactories).toBe(true);
  });

});
