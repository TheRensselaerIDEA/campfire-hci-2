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

// Create instance of HCI library
var hci = new HCI({
  "fullscreen": true,
  "display": true,
  "screenWrap": true,
  "centermode": true,
  "floorURL": floorURL,
  "wallURL": wallURL,
  "mousewrangler": true
});

global.childps = {"app": null};

/**
 * Opens a child app and frees resources that will be required by the app
 * @param {number} appIndex - ChildUtils.appList index of app to open
 */
function openChild(appIndex) {
  hci.inputManager.midiH.stop();
  ChildUtils.openApp(appIndex);
}

/**
 * Closes the child app and reacquire resources that were made available to child process
 */
function closeChild() {
  ChildUtils.killChildPs();
  hci.inputManager.midiH.start();
}

 // Bind input events to ipc events so that the floorWindow can handle them
hci.inputManager.bindForward(() => {
  if (global.childps.app == null) {
    hci.viewController.floorWindow.webContents.send('keyevent', 'up');
  }
});
hci.inputManager.bindBackward(() => {
  if (global.childps.app == null) {
    hci.viewController.floorWindow.webContents.send('keyevent', 'down');
  }
});
hci.inputManager.bindSelect(() => {
  if (global.childps.app == null) {
    hci.viewController.floorWindow.webContents.send('keyevent', 'select');
  }
});
hci.inputManager.midiH.bindKnobHandler(
  hci.inputManager.midiH.KNOB_CODE.LEVEL_RATE,
  (pos) => {
    hci.viewController.floorWindow.webContents.send('selectEvent', pos);
  }
);
hci.inputManager.midiH.bindKnobHandler(
  hci.inputManager.midiH.KNOB_CODE.KNOB_01,
  (pos) => {
    hci.viewController.floorWindow.webContents.send('rotate-event', pos);
  }
);

// Configuration in this block must occur after electron has been initialized, so it is deferred until the ready event occurs
electron.app.on('ready', () => {
  // handle quit keyboard shortcut while launcher is open in foreground/background
  electron.globalShortcut.register('CommandOrControl+K', closeChild);
  // handle the open-app event
  electron.ipcMain.on('open-app', function(event, appIndex) {
    openChild(appIndex);
  });
});

// Configure electron to kill any subprocesses on exit
electron.app.on('quit', closeChild);
