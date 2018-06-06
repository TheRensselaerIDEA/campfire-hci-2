/*
  Simple example of a campfire-hci-2 application
*/

// Import dependencies
const ViewController = require("campfire-hci-2");
const electron = require('electron');

// Create application by calling ViewController
var view = ViewController({
  "fullscreen": true,
  "display": true,
  "screenWrap": true,
  "centermode": false,
  "floorURL": "http://129.161.47.176:5000/",
  "wallURL": "https://docs.google.com/presentation/d/1zMP_JrZ0mVj6jsnnCh9r-v5tSKNi97eihXcYZYjuxLk/present?slide=id.p",
  "mousewrangler": true
});
