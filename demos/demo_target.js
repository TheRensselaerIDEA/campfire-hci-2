/**
 * Example of a barebones campfire-hci-2 application
 */

const path = require("path");
const ViewController = require("campfire-hci-2");
const electron = require('electron');

const fileDir = 'file://' + __dirname;
const floorURL = path.join(fileDir, 'images', 'target2_invert.png');
const wallURL = path.join(fileDir, 'images', 'wall_invert.png');

var demoApp = ViewController({
  "fullscreen": true,
  "display": true,
  "screenWrap": true,
  "centermode": false,
  "floorURL": floorURL,
  "wallURL": wallURL,
  "mousewrangler": true
});
