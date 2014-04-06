'use strict';

/**************************************
            * Controllers
 *************************************/

// signUp.jade form validation, ajax call, & saves to mongodb //

angular.module( 'myApp.controllers', [] ).
  controller('SignUpCtrl', function ( $scope, $http ) {
    
    // Saves newUsers from signUp.jade to mongo( User ) //

    $scope.saveUser = function ( newUser ) {

      // Logs form information in JSON
      console.log( newUser );

      $http.post( '/signup', newUser ).
        success( function ( data, status, headers, config ) {

          angular.element( document.querySelector( '.sign-up-form' ) ).val( "" );

        }).
        error( function ( data, status, headers, config ) {

          $scope.newUser = [{

            user      : data,
            email     : data,
            password  : data,
            numMeals  : data,
            numHours  : data,
            createdAt : Date.now()
          
          }];

        });

      };

  }).
  controller( 'LoginCtrl', function ( $scope, $http ) {

    $scope.checkUser = function ( oldUser ) {

      console.log( oldUser );

      $http.post( '/login', oldUser ).
        success( function ( data, status, headers, config ) {

        }).
        error( function ( data, status, headers, config) {


          $scope.oldUser = [{

            user      : data,
            password  : data

          }];

        });

    }

  });






















  