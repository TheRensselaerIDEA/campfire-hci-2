'use strict'; // Ensure variables are declared explicitly

// Imports
const electron = require('electron');
const MouseListener = require('./MouseListener.js')

// Constants
const DEFAULT_FLOOR_URL = 'http://bit.ly/CampfireFloorSlide';
const DEFAULT_WALL_URL = 'http://bit.ly/CampfireWallSlide';

// Module definition
module.exports = function ViewController(args) {

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
    // Configure Screens
    this.setScreens();
    this.createWindow(
      this.params["display"],
      this.params["wallurl"],
      this.params["floorurl"],
      this.params["fullscreen"]
    );
    this.listener = new MouseListener(
      this.floorScreen,
      this.wallScreen,
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
    var allScreens = electron.screen.getAllDisplays();
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
      webPreferences:{ nodeIntegration: true }
    });
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
    });

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
    });
  };
}
