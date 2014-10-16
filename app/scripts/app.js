'use strict';

/**
 * @ngdoc overview
 * @name jetgrizzlyApp
 * @description
 * # jetgrizzlyApp
 *
 * Main module of the application.
 */


var app = angular.module('jetgrizzlyApp', []);

app.controller('timerController', function($scope, $interval){
  var FB = new Firebase('https://blistering-heat-6745.firebaseio.com');

  $scope.minutes = 0;
  $scope.seconds = 0;
  var myOffset = 0;
  var RESET_SECONDS = 25;
  var endsAt = 0;
  var timeout = null;  

  FB.child('.info/serverTimeOffset').on('value', function(snap) {
     myOffset = snap.val()||0;
  });

  FB.child('running').on('value', function(snap){
    console.log("firebase running callback called");
    var b = !! snap.val();
    if (b) {
      //  countDown();
        timeout = $interval(countDown, 1000);
    } else {
        $interval.cancel(timeout);
        // timeout = null;
    }    
  });

  FB.child('endtime').on('value', updateEndTime);

 

  $scope.startTimer = function(){
    console.log("start timer called");
    FB.child('running').set(true);
  };
  $scope.stopTimer = function(){
    console.log("stop timer called");
    FB.child('running').set(false);
  }

  $scope.resetTimer = function(){
    console.log("reset timer called")
    FB.child('running').set(false);
    FB.child('endtime').set(now() + RESET_SECONDS * 1000);
  }

  function countDown() {
    console.log("countDown called");
    setTime(Math.max(0, endsAt - now()));
  }

  function updateEndTime(snap) {
    console.log("update end time called");
    endsAt = snap.val()||0;
    console.log("endsAt = ", endsAt);
    countDown();
  }

  function setTime(remaining) {
    console.log("setTime called");
    $scope.minutes = Math.floor(remaining / 60000);
    $scope.seconds = Math.round(remaining / 1000);
    //$('#timer').text(lpad(minutes) + ':' + lpad(seconds));
  }

  function now() {
    return Date.now() + myOffset;
  }

});