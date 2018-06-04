/*
  Author: Antonio Fiol-Mahon
*/

const path = require('path')
const ViewController = require('campfire-hci-2');
const electron = require('electron');
const child_process = require('child_process');

const docRoot = path.join('file://', __dirname, 'docs');
const floorURL = path.join(docRoot, 'floor.html');
const wallURL = path.join(docRoot, 'wall.html');

var view = ViewController({
  "fullscreen": false,
  "display": true,
  "screenWrap": true,
  "centermode": false,
  "floorURL": floorURL,
  "wallURL": wallURL
});

var apps = [
  {"name": "demo_target", "path": "../demo_target/index.js"},
  {"name": "App 2", "path": ""},
  {"name": "App 3", "path": ""}
];


global.appList = apps;

// Data about the open child process
global.openApp = {"pid":null};

// Configure electron to kill any subprocesses on exit
electron.app.on('quit', function() {
  if (global.openApp["pid"] != null) {
    console.log("Killing process " + global.openApp['pid']);
    child_process.exec("pkill -P " + global.openApp['pid']);
  }
});
