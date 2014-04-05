'use strict';

/* Controllers */


angular.module( 'myApp.controllers', [] ).
  controller( 'AppCtrl', function ( $scope, $http ) {

    $http.get( '/signUp' ).
      success ( function ( data, status, headers, config ) {

        $scope.newUser = data;

      }).
      error( function ( data, status, headers, config ) {

        $scope.newUser = [{

          user      : data,
          email     : data,
          password  : data,
          createdAt : Date.now()

        }];

      });

      $scope.save = function ( newUser ) {

        $http.
      }

  });


    $http.post( '', newUser ).
      success( function ( data, status, headers, config) {

        var existing = $scope.newUser;

      }).
      error( function ( data, status, headers, config) {

        $scope.newUser = [{


        }];
      });
  }