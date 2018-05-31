/*
  Simple example of a campfire-hci-2 application
*/

const path = require("path");
const ViewController = require("campfire-hci-2");
const electron = require('electron');

const fileDir = 'file://' + __dirname
const floorURL = path.join(fileDir, 'images', 'target2_invert.png');
const wallURL = path.join(fileDir, 'images', 'wall_invert.png');

var demoApp = new ViewController({
  "fullscreen": true,
  "display": true,
  "screenWrap": true,
  "centermode": false,
  "floorURL": floorURL,
  "wallURL": wallURL
});

// Configure application to initialize when electron is ready
electron.app.on('ready', function() {
  demoApp.init();
});
