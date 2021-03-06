module.exports = routesConfig;

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      component: 'home'
    })
    .state('course', {
      url: '/stats/course/:name',
      component: 'course'
    })
    .state('admin', {
      url: '/:name/admin',
      component: 'admin'
    })
    .state('room', {
      url: '/:name',
      component: 'room'
    });
}
