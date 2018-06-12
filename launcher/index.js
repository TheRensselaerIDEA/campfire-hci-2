/*
  Author: Antonio Fiol-Mahon
*/

// Import dependencies
const path = require('path')
const ViewController = require('campfire-hci-2');
const electron = require('electron');
const ChildUtils = require('./ChildUtils.js')

// Static Variable definitions
const docRoot = path.join('file://', __dirname, 'docs');
const floorURL = path.join(docRoot, 'floor.html');
const wallURL = path.join(docRoot, 'wall.html');

// Create View controller
var view = ViewController({
  "fullscreen": true,
  "display": true,
  "screenWrap": true,
  "centermode": false,
  "floorURL": floorURL,
  "wallURL": wallURL,
  "mousewrangler": false
});



// Data about the open child process
global.openApp = {"app":null};

// Configure electron to handle quit command when in background
electron.app.on('ready', () => {
  electron.globalShortcut.register('CommandOrControl+K', ChildUtils.killChildPs);

  var trayIcon = new electron.Tray(path.join('images', 'if_rocket_1054990.png'));
  var trayMenuTemplate = [
    {
      label: 'Open Launcher',
      click: function() {
        
      }
    }
  ]
  var trayMenu = electron.Menu.buildFromTemplate(trayMenuTemplate);
  trayIcon.setContextMenu(trayMenu);
});

// Configure electron to kill any subprocesses on exit
electron.app.on('quit', ChildUtils.killChildPs);
