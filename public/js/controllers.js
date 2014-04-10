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

  $http.get( '/api/home' ).

    success( function ( data, status, headers, config ) {

      $scope.posts = data;


    }).
    error( function ( data, status, headers, config ) {

      console.log( 'Error ' + status );

    });

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

  $scope.meals   = [];
  $scope.userWho = null;
  $scope.countDown = 0;
  
  mealList();
  timer();

  $scope.mealInput = function ( meal ) {

    $http({

    method  : 'POST',
    url     : '/dashboard',
    data    : meal

  }).
    success( function ( data ) {

      if( data.success ) {

        mealList();

      }

    }).
    error( function ( data, status, headers, config ) {

      console.log( 'Error ' + status );

    });

  };

  // retrieves user meal history //
  function mealList() {

    $http({

    method  : 'GET',
    url     : '/api/meals'
  
    }).
    success( function ( data, status, headers, config ) {

      $scope.meals.splice( 0, data.length );
      $scope.userWho = data[0];

      for (var i = 0; i < data.length; i++) {

        $scope.meals.push( data[i] );

      }

    }).
    error( function ( data, status, headers, config ) {

      console.log( "Errors with " + status );
      
    });

  }


  // countdown clock till next meal //
  function timer() {

    $http({

      method  : 'GET',
      url     : '/api/time'

    }).
    success( function ( data, status, headers, config ) {
      
      var mealsLeft     = data.numMeals;
      var interval      = Date.now()+(3600000 * data.numHours);
      var eatenMeals    = null;
      var timeLeft      = null;
      var time          = null;
      var timer         = angular.element( "#timer" );

        setInterval( function() {

          var days,
              hours,
              minutes,
              seconds;

          var currentTime = Date.now();
          var secondsLeft = ( interval - currentTime ) / 1000;

          // 86400 seconds in one day
          days = parseInt( secondsLeft / 86400 );
          secondsLeft = secondsLeft % 86400;

          // 3600 seconds in a hour
          hours = parseInt( secondsLeft / 3600 );
          secondsLeft = secondsLeft % 3600;

          // 60 seconds in a minute
          minutes = parseInt( secondsLeft / 60 );
          seconds = parseInt( secondsLeft % 60 );
    
          timer.html("Hours "+ hours + " | Minutes " + minutes + " | Seconds " + seconds);

        }, 1000);


    }).
    error( function ( data, status, headers, config ) {

      console.log( 'Error ' + status );

    });

  }// timer

});