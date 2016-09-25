var angular = require('angular');
require('angular-mocks');
var room = require('./room');

describe('room component', function () {
  beforeEach(function () {
    angular
      .module('room', ['app/room.html'])
      .component('room', room);
    angular.mock.module('room');
  });

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<room></room>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
