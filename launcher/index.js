/*
  Author: Antonio Fiol-Mahon
*/

const path = require('path')
const ViewController = require('campfire-hci-2');
const electron = require('electron');
const child_process = require('child_process');
var os = require('os');

const docRoot = path.join('file://', __dirname, 'docs');
const floorURL = path.join(docRoot, 'floor.html');
const wallURL = path.join(docRoot, 'wall.html');

var view = ViewController({
  "fullscreen": false,
  "display": true,
  "screenWrap": true,
  "centermode": false,
  "floorURL": floorURL,
  "wallURL": wallURL,
  "mousewrangler": false
});

// provide access to views for renderer processes
global.view = view;

var apps = [
  {"name": "demo_target", "path": "../demo_target/index.js"},
  {"name": "App 2", "path": ""},
  {"name": "App 3", "path": ""}
];

// Data about the open child process
global.openApp = {"app":null};

/*
  Terminates a child process if one is open
*/
function killChildPs() {
  console.log("attempting to kill ps "+global.openApp['app']);
  if (global.openApp["app"] != null) {
    console.log("Killing process " + global.openApp['app'].pid);
    // Use the kill command appropriate for the platform
    if (os.platform() == 'win32') {
      global.openApp['app'].kill("SIGKILL");
    } else {
      child_process.exec('pkill -P ' + global.openApp['app'].pid); // Kill the process
    }
    global.openApp["app"] = null;
  }
}

global.appList = apps;


// Configure electron to handle quit command when in background
electron.app.on('ready', () => {
  electron.globalShortcut.register('CommandOrControl+X', killChildPs);
});

// Configure electron to kill any subprocesses on exit
electron.app.on('quit', killChildPs);
