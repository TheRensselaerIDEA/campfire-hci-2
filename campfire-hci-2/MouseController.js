// Imports
const electron = require('electron');
const robot = require('robotjs');

// Check if win-mouse is available, if so import it and set flag
var winMousePresent;
try {
  const winMouse = require('win-mouse')();
  winMousePresent = true;
} catch(err) {
  console.log("WARN: WinMouse unavailable, skipping mouse event binding...")
  winMousePresent = false;
}

// Constants
const DEFAULT_FLOOR_URL = 'http://bit.ly/CampfireFloorSlide';
const DEFAULT_WALL_URL = 'http://bit.ly/CampfireWallSlide';

// Module definition
module.exports = function MouseController(args) {

  // Set Default parameters
  this.params = {
    "display": true,
    "screenwrap": true,
    "centermode": true,
    "fullscreen": true,
    "floorurl": DEFAULT_FLOOR_URL,
    "wallurl": DEFAULT_WALL_URL
  }
  // Overwrite Default parameters with provided values
  if (Object.keys(args).length > 0) {
    var val, arg;
    for (arg in args) {
      val = args[arg];
      arg = arg.toLowerCase();
      this.params[arg] = val;
    }
  }

  /* Initialize screen variables with electron. */
  this.init = function() {
    this.setScreens();
    this.createWindow(
      this.params["display"],
      this.params["wallurl"],
      this.params["floorurl"],
      this.params["fullscreen"]
    );
    this.listener(
      this.params["screenwrap"],
      this.params["centermode"],
      false
    );
  };

  /*
    Configure the wall and floor screen var and set offsets
    Larger screen is set to wall screen automatically
  */
  this.setScreens = function() {
    this.wallScreen = null;
    this.floorScreen = null;
    this.floorOffset = 0.75,
    this.wallOffset = 0.25;
    this.screen = electron.screen;
    var allScreens = this.screen.getAllDisplays();
    // If only 1 monitor is present, display both on primary display
    try {
      if (allScreens[0].size.width > allScreens[1].size.width) {
        this.wallScreen = allScreens[0];
        this.floorScreen = allScreens[1]
      } else {
        this.floorScreen = allScreens[0];
        this.wallScreen = allScreens[1];
      }
    } catch(err) {
      this.wallScreen = allScreens[0];
      this.floorScreen = allScreens[0];
    }
  };

  /*
    Create the windows that will display content on the screens
    @param {boolean} displayEnabled: true to show displays
    @param {string} wallURL: URL for wall display
    @param {string} floorURL: URL for floor display
    @param {boolean} fullScreen: true for fullscreen mdoe
  */
  this.createWindow = function(displayEnabled, wallURL, floorURL, fullScreen) {
    // Wall Display Configuration
    var mainWindow = new electron.BrowserWindow({
      x: this.wallScreen.bounds.x,
      y: this.wallScreen.bounds.y,
      width: this.wallScreen.bounds.width,
      height: this.wallScreen.bounds.height,
      show: displayEnabled,
      frame: false,
      webPreferences:{nodeIntegration: true}
    })
    //Forced setting to fit window to campfire screens
    mainWindow.setContentSize(6400,800);
    mainWindow.loadURL(wallURL);

    // Floor Display Configuration
    this.floorScreen.bounds.width=1920;
    this.floorScreen.bounds.height=1080;
    var floorWindow = new electron.BrowserWindow({
      x:this.floorScreen.bounds.x,
      y:this.floorScreen.bounds.y,
      width:this.floorScreen.bounds.width,
      height:this.floorScreen.bounds.height,
      show: displayEnabled,
      frame:false,
      webPreferences:{nodeIntegration: true}
    })

    floorWindow.setContentSize(1920,1080);
    floorWindow.loadURL(floorURL);

    // Set display to fullscreen
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
  };

  /*
    Listens to mouse events and corrects mouse position when required
    @param {boolean} screenWrapEnabled: true if cursor should wrap around wall
    @param {boolean} centerModeEnabled: //TODO document param
    @param {boolean} debugPrintEnabled: true to output debug values to console
  */
  this.listener = function(screenWrapEnabled, centerModeEnabled, debugPrintEnabled) {
    var wall = this.wallScreen;
    var floor = this.floorScreen;
    var fb = floor.bounds;
    var wb = wall.bounds;
    var mPos = robot.getMousePos();
    var borderOffset = 30;
    var onFloor = false;
    var params = this.params;
    //These functions are created in local scope to be used by the event listener.
    var util = {

      /*
        Find angle from origin
        @param {number} dx: distance between centerx and mousex
        @param {number} dy: distance between centery and mousey
        @return {number}: degrees from origin angle
      */
      calcTheta: function(dx, dy) {
        var t = Math.atan2(dy,dx) * 180 / Math.PI; // Degree of angle
        if (t < 0) t = 360 + t;// If negative make it positive by adding 360
        return t
      },

      /*
        @return {boolean}: true if cursor is on floor, false if cursor on wall
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

    /*
      Handle mouse position events for floor/wall
      @param {number} mouseX: mouse x position
      @param {number} mouseY: mouse y position
    */
    var mouseListener = function(mouseX, mouseY) {
      isOnFloor = util.onFloor(mouseX, mouseY, fb);
      //Transitioning from floor to wall
      if (isOnFloor) {
        floorListener(mouseX, mouseY, fCx, fCy, fRadius, floorOffset, borderOffset);
      }
      //Logic for transitioning from wall to floor
      else if(!isOnFloor) {
        wallListener(mouseX, mouseY, fCx, fCy, fRadius, wallOffset, borderOffset);
      }

      if (debugPrintEnabled) {
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
    }

    // Bind MouseListener to winMouse if it is available
    if (winMousePresent) {
      winMouse.on('move', mouseListener);
    }
  };
}
