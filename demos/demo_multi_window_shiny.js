/*
  Simple example of a campfire-hci-2 application
*/

const ViewController = require("campfire-hci-2");
const electron = require('electron');

const shinyURL = "http://lp01.idea.rpi.edu/shiny/erickj4/swotr/";

var demoApp = ViewController({
  "fullscreen": true,
  "display": true,
  "screenWrap": true,
  "centermode": false,
  "floorURL": shinyURL + "?view=Floor",
  "wallURL": shinyURL + "?view=Wall",
  "mousewrangler": false
});
