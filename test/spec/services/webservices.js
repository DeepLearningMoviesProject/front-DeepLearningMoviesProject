'use strict';

describe('Service: WebServices', function () {

  // load the service's module
  beforeEach(module('frontMoviesDeepLearningApp'));

  // instantiate service
  var WebServices;
  beforeEach(inject(function (_WebServices_) {
    WebServices = _WebServices_;
  }));

  it('should do something', function () {
    expect(!!WebServices).toBe(true);
  });

});
