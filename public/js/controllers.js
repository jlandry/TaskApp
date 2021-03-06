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

      var users = data.users; 

      for (var i = 0; i < data.meals.length; i++) {

        var user_id   = data.meals[i].user_Id;
        var user      = getUserById( users, user_id );
        var lastMeal  = data.meals[i].eaten_On;

        // Add new property/values to objects /
        data.meals[i].timeToNextMeal = getTimeToNextMealFor( user, lastMeal )

      }

      $scope.users = data.meals;
      $scope.posts = data.meals;

    }).
    error( function ( data, status, headers, config ) {

      console.log( 'Error ' + status );

    });

});

/**********
  HELPERS
***********/

// matches users collection to meals collection //
function getUserById (users, user_id) {

  // returns user by user_id in users list //
  for ( var i = 0; i < users.length; i++ ) {

    if( users[i]._id == user_id ){
      // returns a User model
      return users[i];

    }

  }

  return {}; // if its not found

}


// countdown timer for index page //
function getTimeToNextMealFor ( user, meal ) {


  var lastMeal  = new Date( meal ).getTime();
  var timeTill  = lastMeal + ( 3600000 * user.numHours );

  return timeTill;

}


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

  $scope.meals      = [];
  $scope.userWho    = null;
  $scope.countDown  = 0;
  
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

    var secondsLeft = null;

    $http({

      method  : 'GET',
      url     : '/api/time'

    }).
    success( function ( data, status, headers, config ) {
      
      var it = data.food[0].eaten_On;
          it = new Date(it).getTime();

      var totalMeals     = data.user.numMeals;
      var mealsEaten     = 0;
      var time2Eat       = Date.now() + 3600;
      var interval       = it + ( 3600 * data.user.numHours );
      var timeLeft       = null;
      var timer          = angular.element( "#timer" );
      

        // Timer till next meal //
        setInterval( function() {

          var days,
              hours,
              minutes,
              seconds,
              days2,
              hours2,
              minutes2,
              seconds2;

          var currentTime = Date.now();
              secondsLeft = ( interval - currentTime ) / 1000;

          // 86400 seconds in one day
          days        = parseInt( secondsLeft / 86400 );
          secondsLeft = secondsLeft % 86400;

          // 3600 seconds in a hour
          hours       = parseInt( secondsLeft / 3600 );
          secondsLeft = secondsLeft % 3600;

          // 60 seconds in a minute
          minutes     = parseInt( secondsLeft / 60 );
          seconds     = parseInt( secondsLeft % 60 );
    
          timer.html("Next Meal In : Hours "+ hours + " | Minutes " + minutes + " | Seconds " + seconds);

          // Meal time timer //
          if ( secondsLeft < 0 ) {

            var lunch       = Date.now();
            var secondsOn   = ( time2Eat - lunch ) / 1000;

            days2           = parseInt( secondsOn / 86400 );
            secondsOn       = secondsOn % 86400;

            hours2          = parseInt( secondsOn / 3600 );
            secondsOn       = secondsOn % 3600;

            minutes2        = parseInt( secondsOn / 60 );
            seconds2        = parseInt( secondsOn % 60 );

            timer.html( "Time to Eat : "+ minutes2 + " Minutes" + " & " + seconds2 + " Seconds" );

            if ( secondsOn < 0 ) {


            }

          }

        }, 1000);
        

    }).
    error( function ( data, status, headers, config ) {

      console.log( 'Error ' + status );

    });

  }// timer

});