'use strict';

/***********************************************
                  * Controllers
 ***********************************************/

// Module //

var app = angular.module( 'myApp.controllers', [] );


/*************************
      * signUp.jade
 *************************/

app.controller('SignUpCtrl', function ( $scope, $http, $location) {
  
  // Saves newUsers from signUp.jade to mongo( User ) //

  $scope.saveUser = function ( newUser ) {

    // Logs form information in JSON
    console.log( newUser );

    $http.post( '/signup', newUser ).
      success( function ( data, status, headers, config ) {

        if ( data.success ) {

          $location.path( '/login' );

        }

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

});


/*************************
      * login.jade
 *************************/

app.controller( 'LoginCtrl', function ( $scope, $http ) {

  // Holds data from login form 
  $scope.checkUser = {};

  $scope.checkUser = function ( oldUser ) {

    $http({

      method    : 'POST',
      url       : '/login',
      data      : $.param( $scope.checkUser ), // Pass data as stings
      headers   : { 'Content-Type' : '/'}

    }).
    success( function ( data ) {

      console.log( data );

      if ( !data.success ) {

        // if not successful, bind errors to error variables
        //$scope.errorName = data.errors.name;

      } else {

        $location.path( '/dashboard' );

      }
    });
  };

});

/*************************
      * dashboard.jade
 *************************/


app.controller( 'DashboardCtrl', function ( $scope, $http ) {


});




  