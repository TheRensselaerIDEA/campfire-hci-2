/**
 * ViewSimple.js
 * 
 * Simple ViewController that initializes from the arguments
 * of the App Definition at the specified index in appList.json
 * 
 * Author: Antonio Fiol-Mahon
 */

'use strict';

// Import dependencies
const electron = require('electron');
const HCI = require("campfire-hci-2");

// Get command line argument and check for validitiy
const app_id = process.argv[2];
if (app_id == undefined) {
  console.log("Missing parameter 'index', exiting...");
  electron.app.exit();
}

// Retrieve the arguments through ChildUtils
const ChildUtils = require("./ChildUtils.js");
const params = ChildUtils.appList[app_id]["args"];
 
// Create application by calling ViewController
var view = new HCI(params);