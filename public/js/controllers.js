'use strict';

/***********************************************
                  * Controllers
 ***********************************************/

// Module //

var app = angular.module( 'myApp.controllers', [] );

/*************************
      * index.html
 *************************/

app.controller( 'MyAppCtrl', function ( $scope, $http, $location ) {


});




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

app.controller( 'LoginCtrl', function ( $scope, $http, $location ) {

  // Holds data from login form 
  $scope.checkUser = {};

  $scope.checkUser = function ( oldUser ) {

    $http({

      method    : 'POST',
      url       : '/login',
      data      : oldUser

    }).
    success( function ( data ) {

      if ( !data.success ) {

        // if not successful, bind errors to error variables
        // $scope.errorUserName      = data.errors.oldUser.username;
        // $scope.errorUserPassword  = data.errors.oldUser.password;

      } else {

        $location.path( '/dashboard' );

      }

    });

  };

});

/*************************
      * dashboard.jade
 *************************/


app.controller('DashboardCtrl', function ( $scope, $http ) {

  $scope.mealInput = function ( meal ) {

    $http({

    method  : 'POST',
    url     : '/dashboard',
    data    : meal

  }).
    success( function ( data ) {


    }).
    error( function () {

    });
    
  };

});
