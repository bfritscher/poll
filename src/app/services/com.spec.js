var angular = require('angular');
require('angular-mocks');
var {Com} = require('./com');

describe('Com service', function () {
  beforeEach(function () {
    angular
      .module('Com', [])
      .service('Com', Com);
    angular.mock.module('Com');
  });

  it('should', angular.mock.inject(function (Com) {
    expect(Com.getData()).toEqual(3);
  }));
});
