/*
  Simple example of a campfire-hci-2 application
*/

// Import dependencies
const ViewController = require("campfire-hci-2");
const electron = require('electron');

// Create application by calling ViewController
var demoApp = ViewController({
  "fullscreen": true,
  "display": true,
  "screenWrap": true,
  "centermode": false,
  "floorURL": "http://bit.ly/CampfireFloorSlideFull",
  "wallURL": "http://bit.ly/CampfireWallSlideFull",
  "mousewrangler": true
});
