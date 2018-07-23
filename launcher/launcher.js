/**
 * launcher.js
 * 
 * Entry point for campfire launcher
 * Manages High level app coordination and input/output handling
 * 
 * Author: Antonio Fiol-Mahon
 */

'use strict';

// Import dependencies
const path = require('path')
const HCI = require('campfire-hci-2');
const electron = require('electron');
const ChildUtils = require('./ChildUtils.js');

// Constant definitions
const FLOOR_URL = path.join('file://', __dirname, 'docs', 'floor.html');
const WALL_URL = path.join('file://', __dirname, 'docs', 'wall.html');
const QUIT_ACCELERATOR = 'CommandOrControl+K'
const UNIT_ROTATION = 10; // Smallest rotation increment for launcher reorientation


var launcherRotation = 0; // Current Launcher UI offset (in degrees)
global.childps = {'app': null};

// Create instance of HCI library
var hci = new HCI({
  'fullscreen': true,
  'display': true,
  'screenWrap': true,
  'centermode': true,
  'floorURL': FLOOR_URL,
  'wallURL': WALL_URL,
  'mousewrangler': true
});

 // Bind keyboard input to IPC events so that the UI Thread can handle them appropriately
hci.inputManager.bindForward(() => {
  if (!ChildUtils.isChildOpen()) {
    hci.viewController.floorWindow.webContents.send('keyevent', 'up');
  }
});
hci.inputManager.bindBackward(() => {
  if (!ChildUtils.isChildOpen()) {
    hci.viewController.floorWindow.webContents.send('keyevent', 'down');
  }
});
hci.inputManager.bindSelect(() => {
  if (!ChildUtils.isChildOpen()) {
    hci.viewController.floorWindow.webContents.send('keyevent', 'select');
  }
});
hci.inputManager.bindForwardPress(() => {
  if (!ChildUtils.isChildOpen()) {
    launcherRotation += UNIT_ROTATION;
    hci.viewController.floorWindow.webContents.send('rotate-event', launcherRotation);
  }
});
hci.inputManager.bindBackwardPress(() => {
  if (!ChildUtils.isChildOpen()) {
    launcherRotation -= UNIT_ROTATION;
    hci.viewController.floorWindow.webContents.send('rotate-event', launcherRotation);
  }
});

// Configuration in this block must occur after electron has been initialized, so it is deferred until the ready event occurs
electron.app.on('ready', () => {
  // handle quit shortcut
  electron.globalShortcut.register(QUIT_ACCELERATOR, () => {
    if (ChildUtils.isChildOpen()) {
      ChildUtils.closeApp();
    } else {
      electron.app.exit();
    }
  });

  // handle the open-app event
  electron.ipcMain.on('open-app', function(event, appIndex) {
    ChildUtils.openApp(appIndex);
  });
});