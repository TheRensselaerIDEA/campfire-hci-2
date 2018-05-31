/*
  Author: Antonio Fiol-Mahon
*/

const path = require('path')
const ViewController = require('campfire-hci-2');
const electron = require('electron');

const docRoot = path.join('file://', __dirname, 'docs');
const floorURL = path.join(docRoot, 'floor.html');
const wallURL = path.join(docRoot, 'wall.html');

var launcher = new ViewController({
  "fullscreen": false,
  "display": true,
  "screenWrap": true,
  "centermode": false,
  "floorURL": floorURL,
  "wallURL": wallURL
});

// Configure application to initialize when electron is ready
electron.app.on('ready', function() {
  launcher.init();
});
