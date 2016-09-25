var angular = require('angular');
require('angular-mocks');
var admin = require('./admin');

describe('admin component', function () {
  beforeEach(function () {
    angular
      .module('admin', ['app/admin.html'])
      .component('admin', admin);
    angular.mock.module('admin');
  });

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<admin></admin>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
