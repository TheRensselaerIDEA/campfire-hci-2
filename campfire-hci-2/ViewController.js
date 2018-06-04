'use strict'; // Ensure variables are declared explicitly

// Imports
const electron = require('electron');
const MouseListener = require('./MouseListener.js')

// Constants
const DEFAULT_FLOOR_URL = 'http://bit.ly/CampfireFloorSlide';
const DEFAULT_WALL_URL = 'http://bit.ly/CampfireWallSlide';

/*
  Defines a viewcontroller for managing
  the two campfire displays
*/
function ViewController(args) {
  /*
  Simplify argument reading and allow default values for ommitted args
  */
  this.getArg = function(key, default_val) {
    return (args[key] != undefined) ? args[key] : default_val;
  };

  // Set parameters from args or fall back to a default value
  this.display = this.getArg('display', true);
  this.screenwrap = this.getArg('screenWrap', true);
  this.centermode = this.getArg('centermode', true);
  this.fullscreen = this.getArg('fullscreen', true);
  this.floorURL = this.getArg('floorURL', DEFAULT_FLOOR_URL);
  this.wallURL = this.getArg('wallURL', DEFAULT_WALL_URL);
  this.debugEnabled = this.getArg('debugEnabled', false)

  /* Initialize screen variables with electron. */
  this.init = function() {
    // Configure Screens
    this.setScreens();
    this.createWindow(
      this.display,
      this.wallURL,
      this.floorURL,
      this.fullscreen
    );
    this.listener = new MouseListener(
      this.floorScreen,
      this.wallScreen,
      this.screenwrap,
      this.centermode,
      this.debugEnabled
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
    } catch(err) { // Set both to primary if there is only 1 display available
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
    this.mainWindow = new electron.BrowserWindow({
      x: this.wallScreen.bounds.x,
      y: this.wallScreen.bounds.y,
      width: this.wallScreen.bounds.width,
      height: this.wallScreen.bounds.height,
      show: displayEnabled,
      frame: false,
      webPreferences:{ nodeIntegration: true }
    });
    //Forced setting to fit window to campfire screens
    this.mainWindow.setContentSize(6400,800);
    this.mainWindow.loadURL(wallURL);

    // Floor Display Configuration
    this.floorScreen.bounds.width=1920;
    this.floorScreen.bounds.height=1080;
    this.floorWindow = new electron.BrowserWindow({
      x:this.floorScreen.bounds.x,
      y:this.floorScreen.bounds.y,
      width:this.floorScreen.bounds.width,
      height:this.floorScreen.bounds.height,
      show: displayEnabled,
      frame:false,
      webPreferences:{nodeIntegration: true}
    });

    this.floorWindow.setContentSize(1920,1080);
    this.floorWindow.loadURL(floorURL);

    // Set display to fullscreen
    this.floorWindow.setFullScreen(fullScreen);
    this.mainWindow.setFullScreen(fullScreen);

    // Emitted when the window is closed.
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    // TODO: ensure that this is being dereferenced properly
    this.mainWindow.on('closed', function () {
      this.mainWindow = null;
      this.floorWindow = null;
    });
  };
}


// Module definition
module.exports = function(args) {
  let vc = new ViewController(args);
  // Configure application to initialize when electron is ready
  electron.app.on('ready', function() {
    vc.init();
  });
  return vc;
}
