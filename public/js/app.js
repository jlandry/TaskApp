'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [

  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives'

]).
config( function ( $routeProvider, $locationProvider ) {

  $routeProvider.
    when( '/', {

      templateUrl : 'views/index.html',
      controller  : 'MyAppCtrl'

    }).
    when( '/signUp', {

      templateUrl : 'views/accounts/signUp.html',
      controller  : 'SignUpCtrl'

    }).
    when( '/login', {

      templateUrl : 'views/accounts/login.html',
      controller  : 'LoginCtrl'

    }).
    when( '/dashboard', {

      templateUrl : 'views/accounts/dashboard.html',
      controller  : 'DashboardCtrl'

    }).
    otherwise({

      redirectTo  : '/'

    });

  $locationProvider.html5Mode(true);

});
