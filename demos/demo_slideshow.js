/*
  Simple example of a campfire-hci-2 application
*/

// Import dependencies
const electron = require('electron');
const ViewController = require("campfire-hci-2");

// Create application by calling ViewController
var view = ViewController({
  "fullscreen": true,
  "display": true,
  "screenWrap": true,
  "centermode": false,
  "floorURL": "http://bit.ly/CampfireFloorSlideFull",
  "wallURL": "http://bit.ly/CampfireWallSlideFull",
  "mousewrangler": true
});
