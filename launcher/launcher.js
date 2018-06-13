/*
  Entry point for Campfire Launcher
  Author: Antonio Fiol-Mahon
*/

// Import dependencies
const path = require('path')
const ViewController = require('campfire-hci-2');
const electron = require('electron');
const ChildUtils = require('./ChildUtils.js');
const InputManager = require('./InputManager.js');

var ipcMain = electron.ipcMain


// Static Variable definitions
const docRoot = path.join('file://', __dirname, 'docs');
const floorURL = path.join(docRoot, 'floor.html');
const wallURL = path.join(docRoot, 'wall.html');

// Create View controller
var vc = ViewController({
  "fullscreen": true,
  "display": true,
  "screenWrap": true,
  "centermode": false,
  "floorURL": floorURL,
  "wallURL": wallURL,
  "mousewrangler": false
});

// Create input manager
var im = new InputManager();

// Data about the open child process
global.openApp = {"app":null};


electron.app.on('ready', () => {
  // Configure electron to handle quit command when in background
  electron.globalShortcut.register('CommandOrControl+K', ChildUtils.killChildPs);
  
  // Bind input events to actions on the floorWindow
  im.bindForward(() => {
    if (global.openApp['app'] == null) {
      vc.floorWindow.webContents.send('keyevent', 'up');
    }
  });
  im.bindBackward(() => {
    if (global.openApp['app'] == null) {
      vc.floorWindow.webContents.send('keyevent', 'down');
    }
  });
  im.bindSelect(() => {
    if (global.openApp['app'] == null) {
      vc.floorWindow.webContents.send('keyevent', 'select');
    }
  });
});



// Configure electron to kill any subprocesses on exit
electron.app.on('quit', ChildUtils.killChildPs);
