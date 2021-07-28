/**
 * ViewController.js
 * 
 * Provides a view controller that is talored to the campfires unique setup.
 * Manages the 2 fullscreen windows and makes configuring a view for common use cases easy
 * 
 * Author: Antonio Fiol-Mahon
 */

'use strict';

// Imports
const electron = require('electron');

/**
 * Defines a viewcontroller for managing the two campfire displays
 * @constructor
 * @param {Object} args - object containing optional parameters for construction
 */
module.exports = function ViewController(args) {

  const BG_COLOR = '#21252b';
  const FLOOR_X = 1080;   // changed 20 Nov 2020 (jse) 
  const FLOOR_Y = 1080;  // 21 Mar
  const WALL_X = 6400;
  const WALL_Y = 800;   //21 Mar

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
    this.createWindows(
      this.getArg('display', true),
      this.getArg('wallURL', null),
      this.getArg('floorURL', null),
      this.getArg('fullscreen', true),     // JSE 22 Mar 2022
//      this.getArg('fullscreen', false),  // Added 20 Nov 2020 (jse)
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
    let displayList = electron.screen.getAllDisplays();
    try {
      // Assign the longer display to the wall, the other to the floor
      let primaryScreenLonger = (displayList[0].size.width > displayList[1].size.width);
      this.wallScreen = displayList[(primaryScreenLonger) ? 0 : 1];
      this.floorScreen = displayList[(primaryScreenLonger) ? 1 : 0];
    } catch(err) { // Set both to primary if there is only 1 display available
      this.wallScreen = displayList[0];
      this.floorScreen = displayList[0];
    }
  };

  /**
   * Create the windows that will display content on the screens
   * @param {boolean} displayEnabled: true to show displays
   * @param {string} wallURL: URL for wall display
   * @param {string} floorURL: URL for floor display
   * @param {boolean} fullScreen: true for fullscreen mode
   */
  this.createWindows = function(displayEnabled, wallURL, floorURL, fullScreen, nodeIntegrationEnabled) {

    function closeVC() {
      this.wallWindow = null;
      this.floorWindow = null;
      electron.app.quit();
    };

    function createWindow(screen, sizeX, sizeY, url) {
      let w = new electron.BrowserWindow({
        x: screen.bounds.x,
        y: screen.bounds.y,
        width: screen.bounds.width,
        height: screen.bounds.height,
        show: displayEnabled,
        frame: false,
        backgroundColor: BG_COLOR,
        fullscreen: fullScreen,
        webPreferences:{ nodeIntegration: nodeIntegrationEnabled }
      });
      w.setContentSize(sizeX, sizeY);
      if (url != null) {
        w.loadURL(url);
      }
      w.on('closed', closeVC); // Dereference windows and quit when closed event occurs
      return w;
    }
    
    this.floorWindow = createWindow(this.floorScreen, FLOOR_X, FLOOR_Y, floorURL);
    this.wallWindow = createWindow(this.wallScreen, WALL_X, WALL_Y, wallURL);
    
    const content = "";
    console.log(content.concat("WallScreen: ", this.wallScreen.bounds.width, " x ",  this.wallScreen.bounds.height));
    console.log(content.concat("FloorScreen: ", this.floorScreen.bounds.width, " x ",  this.floorScreen.bounds.height));
    
    // Added 20 Nov 2020 (jse)
    // this.floorWindow.center();
    // this.wallWindow.center();
  };

  // Wait for electron to be available for electron specific config
  electron.app.on('ready', () => {
    this.init();
  });
}
