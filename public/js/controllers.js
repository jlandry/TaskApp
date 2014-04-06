'use strict';

/**************************************
            * Controllers
 *************************************/

 angular.module( 'myApp.controllers', [] ).
  controller('AppCtrl', function ( $scope, $http ) {
    
    // Saves newUsers from signUp.jade to mongo( User ) //

    $scope.saveUser = function( newUser ) {

      console.log( newUser );
      
      $http.post( '/signup', newUser ).
        success( function ( data, status, headers, config ) {

          var existing = $scope.saveUser;

          angular.element( document.querySelector( '.sign-up-form' ) ).val( "" );

        }).
        error( function ( data, status, headers, config ) {

          $scope.newUser = [{

            user      : data,
            email     : data,
            password  : data,
            createdAt : Date.now()
          
          }];

        });
      };

  });