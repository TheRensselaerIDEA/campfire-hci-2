/*
  Entry point for Campfire Launcher
  Author: Antonio Fiol-Mahon
*/

// Import dependencies
const path = require('path')
const HCI = require('campfire-hci-2');
const electron = require('electron');
const ChildUtils = require('./ChildUtils.js');

// Static Variable definitions
const docRoot = path.join('file://', __dirname, 'docs');
const floorURL = path.join(docRoot, 'floor.html');
const wallURL = path.join(docRoot, 'wall.html');
const QUIT_ACCELERATOR = 'CommandOrControl+K'

// Create instance of HCI library
var hci = new HCI({
  'fullscreen': true,
  'display': true,
  'screenWrap': true,
  'centermode': true,
  'floorURL': floorURL,
  'wallURL': wallURL,
  'mousewrangler': true
});

global.childps = {"app": null};

/**
 * Closes the child app and reacquire resources that were made available to child process
 */
function closeChild() {
  ChildUtils.closeApp();
}

 // Bind input events to ipc events so that the floorWindow can handle them
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

var rotatePosition = 0;
const UNIT_ROTATION = 10;

hci.inputManager.bindForwardPress(() => {
  if (!ChildUtils.isChildOpen()) {
    rotatePosition += UNIT_ROTATION;
    hci.viewController.floorWindow.webContents.send('rotate-event', rotatePosition);
  }
});

hci.inputManager.bindBackwardPress(() => {
  if (!ChildUtils.isChildOpen()) {
    rotatePosition -= UNIT_ROTATION;
    hci.viewController.floorWindow.webContents.send('rotate-event', rotatePosition);
  }
});

// Configuration in this block must occur after electron has been initialized, so it is deferred until the ready event occurs
electron.app.on('ready', () => {
  // handle quit shortcut
  electron.globalShortcut.register(QUIT_ACCELERATOR, () => {
    if (ChildUtils.isChildOpen) {
      ChildUtils.closeApp();
    } else {
      electron.app.quit();
    }
  });

  // handle the open-app event
  electron.ipcMain.on('open-app', function(event, appIndex) {
    ChildUtils.openApp(appIndex);
  });
});

// Configure electron to kill any subprocesses on exit
electron.app.on('quit', closeChild);
