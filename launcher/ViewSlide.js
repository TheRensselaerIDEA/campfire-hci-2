/**
 * ViewSlide.js
 * 
 * Google Slides View Controller that initializes from the arguments
 * of the App Definition at the specified index in appList.json
 * Has built in navigation functionality for google slides
 * 
 * Author: Antonio Fiol-Mahon
 */

'use strict';

// Import dependencies
const electron = require('electron');
const HCI = require("campfire-hci-2");

// Get command line argument and check for validitiy
const argIndex = process.argv[2];
if (argIndex == undefined) {
  console.log("Missing parameter 'index', exiting...");
  electron.app.exit();
}

// Retrieve the arguments through ChildUtils
const ChildUtils = require("./ChildUtils.js");
const params = ChildUtils.appList[argIndex]["args"];
 
// Create application by calling ViewController
var view = new HCI(params);

/**
 * Send a key event to both browser windows
 * @param {*} key_code event of interest
 */
function sendEvent(key_code) {
    view.viewController.floorWindow.webContents.sendInputEvent({keyCode: key_code, type: 'keyDown'});
    view.viewController.floorWindow.webContents.sendInputEvent({keyCode: key_code, type: 'char'});
    view.viewController.floorWindow.webContents.sendInputEvent({keyCode: key_code, type: 'keyUp'});

    view.viewController.wallWindow.webContents.sendInputEvent({keyCode: key_code, type: 'keyDown'});
    view.viewController.wallWindow.webContents.sendInputEvent({keyCode: key_code, type: 'char'});
    view.viewController.wallWindow.webContents.sendInputEvent({keyCode: key_code, type: 'keyUp'});
}

// Bind Campfire inputs to both browser windows so that slides advance concurrently
view.inputManager.bindForward(() => { sendEvent('Right'); });
view.inputManager.bindBackward(() => { sendEvent('Left'); });
view.inputManager.bindSelect(() => { sendEvent('Space'); });