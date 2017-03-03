'use strict';

describe('Service: FreeGeoIpFactory', function () {

  // load the service's module
  beforeEach(module('frontMoviesDeepLearningApp'));

  // instantiate service
  var FreeGeoIpFactory;
  beforeEach(inject(function (_FreeGeoIpFactory_) {
    FreeGeoIpFactory = _FreeGeoIpFactory_;
  }));

  it('should do something', function () {
    expect(!!FreeGeoIpFactory).toBe(true);
  });

});
