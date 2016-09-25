var angular = require('angular');
require('angular-mocks');
var lobby = require('./lobby');

describe('lobby component', function () {
  beforeEach(function () {
    angular
      .module('lobby', ['app/lobby.html'])
      .component('lobby', lobby);
    angular.mock.module('lobby');
  });

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<lobby></lobby>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
