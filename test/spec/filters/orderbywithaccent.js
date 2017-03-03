'use strict';

describe('Filter: orderByWithAccent', function () {

  // load the filter's module
  beforeEach(module('frontMoviesDeepLearningApp'));

  // initialize a new instance of the filter before each test
  var orderByWithAccent;
  beforeEach(inject(function ($filter) {
    orderByWithAccent = $filter('orderByWithAccent');
  }));

  it('should return the input prefixed with "orderByWithAccent filter:"', function () {
    var text = 'angularjs';
    expect(orderByWithAccent(text)).toBe('orderByWithAccent filter: ' + text);
  });

});
