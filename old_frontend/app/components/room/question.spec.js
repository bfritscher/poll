var angular = require('angular');
require('angular-mocks');
var question = require('./question');

describe('question component', function () {
  beforeEach(function () {
    angular
      .module('question', ['app/app/question.html'])
      .component('question', question);
    angular.mock.module('question');
  });

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<question></question>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
