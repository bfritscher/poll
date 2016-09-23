var angular = require('angular');

require('angular-ui-router');
require('angular-material');
require('angular-material/angular-material.css');
require('angular-animate');

var routesConfig = require('./routes');

require('./index.css');

var app = 'app';
module.exports = app;

angular
  .module(app, [
    'ui.router',
    'ngMaterial',
    'ngAnimate'
  ])
  .config(routesConfig)
  .component('app', require('./app/hello'))
  .component('question', require('./app/question'));
