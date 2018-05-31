// Imports
const robot = require('robotjs');

// Check if win-mouse is available, if so import it and set flag
var winMousePresent;
const winMouse;
try {
  winMouse = require('win-mouse');
  winMousePresent = true;
} catch(err) {
  console.log("WARN: WinMouse unavailable, skipping mouse event binding...")
  winMousePresent = false;
}

/*
  Find angle from origin in degrees
  @param {number} dx: distance between centerx and mousex
  @param {number} dy: distance between centery and mousey
  @return {number}: degrees from origin angle
*/
function CALCULATE_THETA(dx, dy) {
  var t = Math.atan2(dy,dx) * 180 / Math.PI; // Degree of angle
  if (t < 0) t = 360 + t;// If negative make it positive by adding 360
  return t
}

/*
  @return {boolean}: true if cursor is on floor, false if cursor on wall
*/
function CURSOR_ON_FLOOR(x, y, floorBounds) {
  var xOnFloor = (x <= floorBounds.x + floorBounds.width && x >= floorBounds.x);
  var yOnFloor = (y <= floorBounds.y + floorBounds.height && y >= floorBounds.y);
  return xOnFloor && yOnFloor;
}

/*
  Listens to mouse events and corrects mouse position when required
  @param {boolean} screenWrapEnabled: true if cursor should wrap around wall
  @param {boolean} centerModeEnabled: //TODO document param
  @param {boolean} debugPrintEnabled: true to output debug values to console
*/
module.exports = function MouseListener(floorScreen, wallScreen, screenWrapEnabled, centerModeEnabled, debugPrintEnabled) {

  this.floorBounds = floorScreen.bounds;
  this.wallBounds = wallScreen.bounds;
  this.borderOffset = 30;

  //Center of screen is (origin + length) / 2
  this.fCx = this.floorBounds.x + (this.floorBounds.width)/2;   // Floor center x
  this.fCy = this.floorBounds.y + (this.floorBounds.height)/2;  // Floor center y
  this.wCx = this.wallBounds.x + (this.wallBounds.width)/2;     // Wall center x
  this.wCy = (this.wallBounds.y + this.wallBounds.height)/2;    // Wall center y

  //Radius of floor circle, used to determine threshold for transitioning to wall.
  this.fRadius = (this.floorBounds.height/2)-1;
  //These two offsets determine an origin angle for both screens.
  //Due to the way the wall screen is oriented on top of the floor screen, these variables are required.
  this.floorOffset = 0.75;
  this.wallOffset = 0.25;

  /*
    Wraps the cursor around to the left and right side of the wall
    when they touch the edge
  */
  this.screenWrap = function(x, y) {
    // Cursor is on the floor
    if (y >= this.wallBounds.height - 2) return;
    // Cursor moves from right to left
    if (x >= (this.wallBounds.x + this.wallBounds.width) - 2) {
      console.log("Transitioning right to left")
      robot.moveMouse(this.wallBounds.x + 4, y);
    }
    // Left to right
    else if (x < this.wallBounds.x + 4) {
      console.log("Transitioning left to right");
      robot.moveMouse(this.wallBounds.x + this.wallBounds.width - 4, y);
    }
  };

  /*
    Subcomponent of listener that handles cursor while it is on the wall
  */
  this._wallListener = function(x, y) {
    //Get position of mouse and convert to percentage of x position to width on wall screen.
    var perc = (x - this.wallBounds.x) / this.wallBounds.width;
    var twoPI = Math.PI * 2;
    //convert to radians, degrees dont return correct values using Math.sin, cos
    //Theta's range = [0, 2pi]
    var newWallOffset = twoPI * this.wallOffset;
    //2pi * pi/2 = pi
    var theta = (perc * twoPI) + newWallOffset;
    //Clamp theta to [0, 2pi]
    if (theta > twoPI) {
      theta = Math.abs(theta - twoPI);
    }

    //case for reaching vertical border, the mouse appears on the opposite border.
    if (screenWrapEnabled) {
      util.screenWrap(x, y, this.wallBounds);
    }

    if (x > this.wallBounds.x && y > (this.wallBounds.height)-4) {
      var newRadius = this.fRadius - this.borderOffset;
      var x = this.fCx + (newRadius * Math.cos(theta));
      var y = this.fCy + (newRadius * Math.sin(theta));
      if (centerModeEnabled) {
        x = this.fCx,
        y = this.fCy;
      }
      robot.moveMouse(x, y);
    }
  };

  /*
    Subcomponent of listener that handles cursor while it is on the floor
  */
  this._floorListener = function(x, y) {
    var dx = x - this.fCx;
    var dy = y - this.fCy;
    var theta = CALCULATE_THETA(dx, dy);
    var currentR = Math.sqrt(dx**2 + dy**2);

    //Placeholder for threshold, should check if radius from center to mouse is greater than the screen border
    /* theta/360 outputs a number between 0,1 this fraction of the total wall screen width
      determines x value to place on wall screen.
      The y value is easily determined because the
      mouse will transition from the floor to wall and always appear at the bottom of the wall screen.
    */
    if (currentR > this.fRadius) {
      var frac = theta/360;
      var newFloorOffset = (this.wallBounds.x + this.wallBounds.width) * (this.floorOffset);
      // the fraction of width from the origin: (this.wallBounds.x + (this.wallBounds.width * frac))
      //wallOffset is typically 4800 = (3/4) * 6400 if the origin is at 0 degrees
      var x = newFloorOffset + (this.wallBounds.x + (this.wallBounds.width * frac));
      if (x > this.wallBounds.x + this.wallBounds.width) {
        x -= this.wallBounds.x + this.wallBounds.width;
      }
      var y = this.wallBounds.height - this.borderOffset;
        robot.moveMouse(x, y);
    }
  };

  /*
    Handle mouse position events for floor/wall
    @param {number} mouseX: mouse x position
    @param {number} mouseY: mouse y position
  */
  this.mouseListener = function(mouseX, mouseY) {
    var isOnFloor = CURSOR_ON_FLOOR(mouseX, mouseY, this.floorBounds);
    //Transitioning from floor to wall
    if (isOnFloor) {
      _floorListener(mouseX, mouseY);
    }
    //Logic for transitioning from wall to floor
    else if(!isOnFloor) {
      _wallListener(mouseX, mouseY);
    }

    if (debugPrintEnabled) {
      var debug_msg = "";
      debug_msg += "\nOnFloor = " + isOnFloor
      debug_msg += "\n Current R - " + currentR;
      debug_msg += "\n(Mx, My): " + "(" + xPos + "," + yPos + ")";
      debug_msg += "\nWall Center: " + wCx + "," + (wCy);
      debug_msg += "\nFloor Center" + this.fCx + "," + this.fCy;
      debug_msg += "\n" + this.fCx + "," + this.fCy;
      console.log(debug_msg);
    }
  };

  // Bind MouseListener to winMouse if it is available
  if (winMousePresent) {
    winMouse.on('move', this.mouseListener);
  }
}
