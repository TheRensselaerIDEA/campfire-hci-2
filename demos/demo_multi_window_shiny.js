/*
  Simple example of a campfire-hci-2 application
*/
const ViewController = require("campfire-hci-2");
const electron = require('electron');

const mwsURL = "https://lp01.idea.rpi.edu/shiny/erickj4/mwsdemo/"

var demoApp = ViewController({
  "fullscreen": true,
  "display": true,
  "screenWrap": true,
  "centermode": false,
  "floorURL": mwsURL + "?Floor",
  "wallURL": mwsURL + "?Wall",
  "mousewrangler": true,
  "nodeIntegration": false
});
