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
  "floorURL": "https://docs.google.com/presentation/d/1j4Zn-o5UuUOaKqVm5vJu2IqcN_X485Cd4wFHl7YfvfY/present?slide=id.p",
  "wallURL": "https://docs.google.com/presentation/d/14PRCr90QDENrT5B_5MN5cmd95n82MiWsn03m3bSE4s8/present?slide=id.p",
  "mousewrangler": true
});
