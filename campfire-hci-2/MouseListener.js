/*
  Author: Tommy Fang
  Date: 3/20/2018
  Advisors: Professors Jim Hendler and John Erickson
  Rensselaer Polytechnic Institute Master's Project Spring 2018

  Adapted into seperate class by Antonio Fiol-Mahon
*/

// Imports
const robot = require('robotjs');

// Check if win-mouse is available, if so import it and set flag
var winMousePresent;
var winMouse;
try {
  winMouse = require('win-mouse')();
  winMousePresent = true;
} catch(err) {
  console.log("WARN: WinMouse unavailable, skipping mouse event binding...")
  winMousePresent = false;
}

module.exports = function MouseListener(floorScreen, wallScreen, screenWrap, centerMode) {

  var util = {
    //Input: dx: distance between centerx and mousex
    //       dy: distance between centery and mousey
    //Output: degrees from origin angle
    calcTheta: function(dx, dy) {
      //degree of angle
      var t = Math.atan2(dy,dx) * 180 / Math.PI;
      if (t < 0) t = 360 + t;
      return t
    },

    //determines if the mouse cursor is within the boundaries of the floor, else we are on the wall.
    onFloor: function(x, y, fb) {
      return ((x <= fb.x + fb.width && x >= fb.x) && (y <= fb.y + fb.height && y >= fb.y));
    },

    screenWrap: function(x, y, wb) {
        //moving right to left
        if (y >= wb.height-2) return;
        if (x >= (wb.x + wb.width)-2) {
          console.log("Transitioning right to left")
          robot.moveMouse(wb.x+4, y);
        }
        //left to right
        else if (x < wb.x + 4) {
          console.log("Transitioning left to right");
          robot.moveMouse(wb.x+wb.width-4, y);
        }
        return;
    }
  };

  // These values must be defined in the local scope for event listener
  var fb = floorScreen.bounds; // TODO: move up into parameter, only use of floorscreen
  var wb = wallScreen.bounds; // TODO same as above
  var mPos = robot.getMousePos();
  var borderOffset = 30;
  var onFloor = false;
  //These functions are created in local scope to be used by the event listener.

  var wallListener = function(x, y, fCx, fCy, fRadius, wallOffset, borderOffset) {
      //Get position of mouse and convert to percentage of x position to width on wall screen.
      var perc = (x - wb.x) / wb.width,
      twoPI = Math.PI * 2,
      //convert to radians, degrees dont return correct values using Math.sin, cos
      //Theta's range = [0, 2pi]
      wallOffset = twoPI * wallOffset,
      //2pi * pi/2 = pi
      theta = (perc * twoPI) + wallOffset;
      //Clamp theta to [0, 2pi]
      if (theta > twoPI) {
        theta = Math.abs(theta - twoPI);
      }
      //case for reaching vertical border, the mouse appears on the opposite border.
      if (screenWrap) {
          util.screenWrap(x, y, wb);
      }
      if (x > wb.x && y > (wb.height)-4) {
        var newRadius = fRadius - borderOffset;
        var x = fCx + (newRadius * Math.cos(theta));
        var y = fCy + (newRadius * Math.sin(theta));
        if (centerMode) {
          x = fCx,
          y = fCy;
        }
        robot.moveMouse(x, y);
      }
  }
  var floorListener = function(x, y, fCx, fCy, fRadius, floorOffset, borderOffset) {
    var dx = x - fCx;
    var dy = y - fCy;
    var theta = util.calcTheta(dx, dy);
    var currentR = Math.sqrt(dx**2 + dy**2);

    //Placeholder for threshold, should check if radius from center to mouse is greater than the screen border
    if (currentR > fRadius) {
      /* theta/360 outputs a number between 0,1 this fraction of the total wall screen width
        determines x value to place on wall screen.
        The y value is easily determined because the
        mouse will transition from the floor to wall and always appear at the bottom of the wall screen.
      */
      var frac = theta/360;
      var floorOffset = (wb.x + wb.width) * (floorOffset);
      // the fraction of width from the origin: (wb.x + (wb.width * frac))
      //wallOffset is typically 4800 = (3/4) * 6400 if the origin is at 0 degrees
      var x = floorOffset + (wb.x + (wb.width * frac));
      if (x > wb.x + wb.width) {
        x -= wb.x + wb.width;
      }
      var y = wb.height - borderOffset;
      robot.moveMouse(x, y);
    }
  }
  //Center of screen is (origin + length) / 2
  var fCx = fb.x + (fb.width)/2;
  var fCy = fb.y + (fb.height)/2;
  var wCx = wb.x + (wb.width)/2;
  var wCy = (wb.y + wb.height)/2;
      //Radius of floor circle, used to determine threshold for transitioning to wall.
  var fRadius = (fb.height/2)-1;
      //These two offsets determine an origin angle for both screens.
      //Due to the way the wall screen is oriented on top of the floor screen, these variables are required.
  var floorOffset = 0.75;
  var wallOffset = 0.25;
  var isOnFloor = false;
  var lastX = null;
  var lastY = null;
  // Event Listener: Receives x and y positions of the mouse
  if (winMousePresent) {
    winMouse.on('move', function(mouseX, mouseY) {
      isOnFloor = util.onFloor(mouseX, mouseY, fb);
      //Transitioning from floor to wall
      if (isOnFloor) {
        floorListener(mouseX, mouseY, fCx, fCy, fRadius, floorOffset, borderOffset);
      }
      //Logic for transitioning from wall to floor
      else if(!isOnFloor) {
        wallListener(mouseX, mouseY, fCx, fCy, fRadius, wallOffset, borderOffset);
      }
    });
  }
}
