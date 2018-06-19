'use strict'; // Ensure variables are declared explicitly

// Imports
const electron = require('electron');

/**
 * Defines a viewcontroller for managing the two campfire displays
 * @constructor
 * @param {Object} args - object containing optional parameters for construction
 */
module.exports = function ViewController(args) {

  /**
   * Get an argument or its default value
   * @param {String} key argument key
   * @param {*} default_val fallback value if args does not define key
   */
  this.getArg = function(key, default_val) {
    return (args[key] != undefined) ? args[key] : default_val;
  };

  /**
   * Initialize screen variables with electron.
   */
  this.init = function() {
    // Configure Screens
    this.setScreens();
    this.createWindow(
      this.getArg('display', true),
      this.getArg('wallURL', null),
      this.getArg('floorURL', null),
      this.getArg('fullscreen', true),
      this.getArg('nodeIntegration', true)
    );
  };

  /**
   * Configure the wall and floor screen var and set offsets
   * Larger screen is set to wall screen automatically
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

  /**
   * Create the windows that will display content on the screens
   * @param {boolean} displayEnabled: true to show displays
   * @param {string} wallURL: URL for wall display
   * @param {string} floorURL: URL for floor display
   * @param {boolean} fullScreen: true for fullscreen mode
   */
  this.createWindow = function(displayEnabled, wallURL, floorURL, fullScreen, nodeIntegrationEnabled) {

    // Wall Display Configuration
    this.mainWindow = new electron.BrowserWindow({
      x: this.wallScreen.bounds.x,
      y: this.wallScreen.bounds.y,
      width: this.wallScreen.bounds.width,
      height: this.wallScreen.bounds.height,
      show: displayEnabled,
      frame: false,
      backgroundColor: '#21252b',
      fullscreen: fullScreen,
      webPreferences:{ nodeIntegration: nodeIntegrationEnabled }
    });
    //Forced setting to fit window to campfire screens
    this.mainWindow.setContentSize(6400,800);
    if (wallURL != null) {
      this.mainWindow.loadURL(wallURL);
    }

    // Floor Display Configuration
    
    //this.floorScreen.bounds.width=1920;
    //this.floorScreen.bounds.height=1080;
    this.floorWindow = new electron.BrowserWindow({
      x:this.floorScreen.bounds.x,
      y:this.floorScreen.bounds.y,
      width:this.floorScreen.bounds.width,
      height:this.floorScreen.bounds.height,
      show: displayEnabled,
      frame:false,
      backgroundColor: '#21252b',
      fullscreen: fullScreen,
      webPreferences:{nodeIntegration: nodeIntegrationEnabled }
    });

    this.floorWindow.setContentSize(1920,1080);
    if (floorURL != null) {
      this.floorWindow.loadURL(floorURL);
    }

    // Dereference the windows and ensure app closes down properly
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
      this.floorWindow = null;
      electron.app.quit();
    });
    this.floorWindow.on('closed', () => {
      this.mainWindow = null;
      this.floorWindow = null;
      electron.app.quit();
    });
  };

  // Wait for electron to be available for electron specific config
  electron.app.on('ready', () => {
    this.init();
  });
}
