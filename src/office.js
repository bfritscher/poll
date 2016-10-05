Office.initialize = function () {
  console.log('>>> Office.initialize()');
  // fix office
  window.history.replaceState = null;
  window.history.pushState = null;
  angular.module(app).config(function ($locationProvider) {
    $locationProvider.html5Mode(false);
  });
  angular.bootstrap(document.body, ['app']);
};
