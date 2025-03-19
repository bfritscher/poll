var angular = require('angular');
require('angular-mocks');
var results = require('./results');

describe('results component', function () {
  beforeEach(function () {
    angular
      .module('results', ['app/results.html'])
      .component('results', results);
    angular.mock.module('results');
  });

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<results></results>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
