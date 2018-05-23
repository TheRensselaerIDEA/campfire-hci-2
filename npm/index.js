/*
  Author: Tommy Fang
  Date: 3/20/2018
  Advisors: Professors Jim Hendler and John Erickson
  Rensselaer Polytechnic Institute Master's Project Spring 2018

  Please see attached slides for references on figures which are crucial
  in explaining the logic behind this architecture.

  Modified By Antonio Fiol-Mahon on 5/22/2018
*/

'use strict';

// Parameters: An electron.screen object
// Output: Enable mouse event listener and carry out functions based on user mouse positions (x,y).
module.exports = function(args) {
  // Load Required Modules
  const electron = require('electron');
  const robot = require('robotjs');
  //TODO Why isnt mouse const?
  var mouse = require('win-mouse')();
  const path = require('path');
  const url = require('url');
  // Add helper definitions
  const app = electron.app; // Control application life
  const BrowserWindow = electron.BrowserWindow; // Browser Window Handling

  /*
    Contains all code related to mouse utilities.
  */
  var mouseController = {

    /* Initialize screen variables with electron. */
    init: function(args) {
      this.setArgs(args);
      this.screens = this.setScreens(); //TODO doesnt need assignment?
      this.createWindow();
      this.listener();
      console.log("MouseController Initialized")
    },

    /*
      Set parameters for mouseController from args
      If a value is missing, the default value
      is used in its place
    */
    setArgs: function(args) {
      // Set Default values
      this.params = {
        "display": true,
        "screenwrap": true,
        "centermode": false,
        "fullscreen": true,
        "floorurl": 'http://bit.ly/CampfireFloorSlide',
        "wallurl": 'http://bit.ly/CampfireWallSlide'
      };

      // Replace defaults with available values from arg
      if (Object.keys(args).length > 0) {
        var val, arg;
        for (arg in args) {
          val = args[arg];
          arg = arg.toLowerCase();
          this.params[arg] = val;
        }
      }
    },

    /*
      Configure the wall and floor screen var and set offsets
      Larger screen is set to wall screen automatically
    */
    setScreens: function() {
      this.wallScreen = null;
      this.floorScreen = null;
      this.floorOffset = 0.75,
      this.wallOffset = 0.25;
      this.screen = electron.screen;
      var allScreens = this.screen.getAllDisplays();
      var main = this.screen.getPrimaryDisplay(); //TODO remove?
      if (allScreens[0].size.width > allScreens[1].size.width) {
        this.wallScreen = allScreens[0];
        this.floorScreen = allScreens[1]
      } else {
        this.floorScreen = allScreens[0];
        this.wallScreen = allScreens[1];
      }
    },

    /*
      Create the windows that will display content on the screens
    */
    createWindow: function() {
      //Set screen variables to electron screen objects
      var floorScreen = this.floorScreen;
      var wallScreen = this.wallScreen;
      var floorWindow = null
      var mainWindow = null;
      //Set local variables to values of arguments.
      var displayEnabled = this.params["display"];
      var wallURL = this.params["wallurl"]
      var floorURL = this.params["floorurl"];

      //Mouse support entry point
      var mainScreen = this.screen.getPrimaryDisplay() // TODO remove?
      var allScreens = this.screen.getAllDisplays();

      mainWindow = new BrowserWindow({
        x: wallScreen.bounds.x,
        y: wallScreen.bounds.y,
        width: wallScreen.bounds.width,
        height: wallScreen.bounds.height,
        show: displayEnabled,
        frame: false,
        webPreferences:{nodeIntegration: true}
      })
      //Forced setting to fit window to campfire screens
      mainWindow.setContentSize(6400,800);
      mainWindow.loadURL(wallURL);
      //'file://' + __dirname + '/images/wall_invert.png'
      // Create a browser window for the "Floor"...
      // Floor on Campfire must be centered (x position)
      // "Floor" for debug should fill available screen
      floorScreen.bounds.width=1920;
      floorScreen.bounds.height=1080;

      floorWindow = new BrowserWindow({
        x:floorScreen.bounds.x,
        y:floorScreen.bounds.y,
        width:floorScreen.bounds.width,
        height:floorScreen.bounds.height,
        show: displayEnabled,
        frame:false,
        webPreferences:{nodeIntegration: true}
      })

      floorWindow.setContentSize(1920,1080);
      floorWindow.loadURL(floorURL);

      var fullScreen = this.params["fullscreen"];
      floorWindow.setFullScreen(fullScreen);
      mainWindow.setFullScreen(fullScreen);

      // Emitted when the window is closed.
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      // TODO: ensure that this is being dereferenced properly
      mainWindow.on('closed', function () {
        mainWindow = null;
        floorWindow = null;
      })
    },

    /*
      //TODO depricate? cant find internal references may be used by apps
    */
    rotateMouse: function() {
      this.floorSize = this.floorScreen.size;
      var w = this.floorSize.width/2;
      var h = (this.floorSize.height/2);
      var twoPI = Math.PI * 2;
      var x = 0;
      var y = 0;
      var radius = (this.floorSize.height/2)-1;

      //Moves mouse in a circle
      for (var a = 0; a < twoPI; a+=0.1) {
        y = h + radius * Math.sin(a);
        x = w + radius * Math.cos(a);
        robot.moveMouse(x, y);
        console.log("ROBOT MOVING:" + x + "," + y + "," + a);
      }
    },

    /*

    */
    listener: function() {
      var wall = this.wallScreen;
      var floor = this.floorScreen;
      var fb = floor.bounds;
      var wb = wall.bounds;
      var mPos = robot.getMousePos();
      var borderOffset = 30;
      var onFloor = false;
      var params = this.params;
      var screenWrapEnabled = this.params["screenwrap"];
      var centerModeEnabled = this.params["centermode"];
      //These functions are created in local scope to be used by the event listener.
      var util = {
        /*
          Find angle from the origin
          Input:  dx: distance between centerx and mousex
                  dy: distance between centery and mousey
          Output: degrees from origin angle
        */
        calcTheta: function(dx, dy) {
          var t = Math.atan2(dy,dx) * 180 / Math.PI; // Degree of angle
          if (t < 0) t = 360 + t;// If negative make it positive by adding 360
          return t
        },

        /*
          Return true if cursor is on floor, false if cursor on wall
        */
        onFloor: function(x, y, fb) {
          var xOnFloor = (x <= fb.x + fb.width && x >= fb.x);
          var yOnFloor = (y <= fb.y + fb.height && y >= fb.y);
          return xOnFloor && yOnFloor;
        },

        /*
          Wraps the cursor around to the left and right side of the wall
          when they touch the edge
        */
        screenWrap: function(x, y, wb) {
          // Cursor is on the floor
          if (y >= wb.height-2) return;
          // Cursor moves from right to left
          if (x >= (wb.x + wb.width)-2) {
            console.log("Transitioning right to left")
            robot.moveMouse(wb.x+4, y);
          }
          // Left to right
          else if (x < wb.x + 4) {
            console.log("Transitioning left to right");
            robot.moveMouse(wb.x+wb.width-4, y);
          }
        }
      }
      // end of util

      /*
        Subcomponent of listener that handles cursor while it is on the wall
      */
      var wallListener = function(x, y, fCx, fCy, fRadius, wallOffset, borderOffset) {
        //Get position of mouse and convert to percentage of x position to width on wall screen.
        var perc = (x - wb.x) / wb.width;
        var twoPI = Math.PI * 2;
        //convert to radians, degrees dont return correct values using Math.sin, cos
        //Theta's range = [0, 2pi]
        var wallOffset = twoPI * wallOffset;
        //2pi * pi/2 = pi
        var theta = (perc * twoPI) + wallOffset;
        //Clamp theta to [0, 2pi]
        if (theta > twoPI) {
          theta = Math.abs(theta - twoPI);
        }

        //case for reaching vertical border, the mouse appears on the opposite border.
        if (screenWrapEnabled) {
          util.screenWrap(x, y, wb);
        }

        if (x > wb.x && y > (wb.height)-4) {
          var newRadius = fRadius - borderOffset;
          var x = fCx + (newRadius * Math.cos(theta));
          var y = fCy + (newRadius * Math.sin(theta));
          if (centerModeEnabled) {
            x = fCx,
            y = fCy;
          }
          robot.moveMouse(x, y);
        }
      }

      /*
        Subcomponent of listener that handles cursor while it is on the floor
      */
      var floorListener = function(x, y, fCx, fCy, fRadius, floorOffset, borderOffset) {
        var dx = x - fCx;
        var dy = y - fCy;
        var theta = util.calcTheta(dx, dy);
        var currentR = Math.sqrt(dx**2 + dy**2);

        //Placeholder for threshold, should check if radius from center to mouse is greater than the screen border
        /* theta/360 outputs a number between 0,1 this fraction of the total wall screen width
          determines x value to place on wall screen.
          The y value is easily determined because the
          mouse will transition from the floor to wall and always appear at the bottom of the wall screen.
        */
        if (currentR > fRadius) {
          var frac = theta/360,
          floorOffset = (wb.x + wb.width) * (floorOffset);

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
      mouse.on('move', function(mouseX, mouseY) {
        isOnFloor = util.onFloor(mouseX, mouseY, fb);
        //Transitioning from floor to wall
        if (isOnFloor) {
          floorListener(mouseX, mouseY, fCx, fCy, fRadius, floorOffset, borderOffset);
        }
        //Logic for transitioning from wall to floor
        else if(!isOnFloor) {
          wallListener(mouseX, mouseY, fCx, fCy, fRadius, wallOffset, borderOffset);
        }

        /*
        if (DEBUG) {
          var debug_msg = "";
          debug_msg += "\nOnFloor = " + isOnFloor
          debug_msg += "\n(LastX, LastY): " + "(" + lastX + "," + lastY + ")";
          debug_msg += "\n Current R - " + currentR;
          debug_msg += "\n(Mx, My): " + "(" + xPos + "," + yPos + ")";
          debug_msg += "\nWall Center: " + wCx + "," + (wCy);
          debug_msg += "\nFloor Center" + fCx + "," + fCy;
          debug_msg += "\n(Theta): " + "(" + theta + ")";
          debug_msg += "\n" + fCx + "," + fCy;
          console.log(debug_msg);
        }
        */
      });
    }
  }

  app.on('ready', function() {
    mouseController.init(args);
  })
  return mouseController;
}
