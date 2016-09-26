var angular = require('angular');

require('angular-ui-router');
require('angular-material');
require('angular-material/angular-material.css');
require('angular-animate');
require('ng-file-upload');

var routesConfig = require('./routes');

require('./index.css');

var app = 'app';
module.exports = app;

angular
  .module(app, [
    'ui.router',
    'ngMaterial',
    'ngAnimate',
    'ngFileUpload'
  ])
  .config(routesConfig)
  .config(function ($sceProvider) {
    $sceProvider.enabled(false);
  })
  .config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('blue-grey');
  })
  .service('com', require('./app/services/com'))
  .service('avatars', require('./app/services/avatars'))
  .component('home', require('./app/components/home'))
  .component('lobby', require('./app/components/room/lobby'))
  .component('results', require('./app/components/room/results'))
  .component('question', require('./app/components/room/question'))
  .component('room', require('./app/components/room/room'))
  .component('connection', require('./app/components/shared/connection'))
  .component('admin', require('./app/components/admin/admin'));
