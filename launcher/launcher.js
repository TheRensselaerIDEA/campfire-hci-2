/**
 * launcher.js
 * 
 * Entry point for campfire launcher
 * Manages High level app coordination and input/output handling
 * 
 * Author: Antonio Fiol-Mahon
 */

'use strict';

// Imports
const HCI = require('campfire-hci-2');
const electron = require('electron');
const ChildUtils = require('./ChildUtils.js');
const ControllerServer = require('./ControllerServer.js');

const config = require('./config.js');

// Constant definitions
const QUIT_ACCELERATOR = 'CommandOrControl+K';
const UNIT_ROTATION = 10; // Smallest rotation increment for launcher reorientation

const DEMO_MODE = (process.argv.length >= 3 && process.argv[2] == 'demo') ? true : false;
console.log(`Demo Mode: ${DEMO_MODE}`);

var launcherRotation = 0; // Current Launcher UI offset (in degrees)
global.childps = {'app': null};

// Load appList
var appList = ChildUtils.getAppList(DEMO_MODE);

// Create instance of HCI library
var hci = new HCI(config.getSettings().hci);

// Create web controller
var webcontroller = new ControllerServer(config.getSettings().controller_port, appList);

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


  electron.ipcMain.on('get-app-list', function(event, arg) {
    event.returnValue = appList;
  });

  // handle the open-app event
  electron.ipcMain.on('open-app', function(event, app_id) {
    ChildUtils.openApp(app_id);
  });
});