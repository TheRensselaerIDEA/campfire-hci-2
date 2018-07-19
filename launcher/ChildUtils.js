/**
 * A set of utilities for managing a child process
 * Sends relevant events to the remote client on app entry/exit
 */
'use strict';
const child_process = require('child_process');
const os = require('os');
const RemoteClient = require('./RemoteClient.js');

module.exports = {

  appList: require('./appList.json'),

  /**
   * Checks if a child process is currently open
   * @returns true if a child process is open, false otherwise
   */
  isChildOpen: function() {
    return global.childps.app != null;
  },

  /*
    Opens an app from applist.json
    @warn - will fail if called outside of the main thread
    @param {number} index - the index of the application to open
  */
  openApp: function (index) {

    let appDescriptor = this.appList[index];
    console.log(`Opening App '${appDescriptor.name}'`);

    let appProcess = null;
    // If an app is open, close it
    // Ensure an app isnt already open
    if (this.isChildOpen()) {
      try {
        this.closeApp();
      } catch(err) {
        console.log(`Cant kill child, ${err}`);
      }
    }

    // Ask remoteServer to open the remoteURL if one is specified
    if (typeof appDescriptor['remoteURL'] == 'string') {
      RemoteClient.openURL(appDescriptor['remoteURL']);
    }

    // Start a basic ViewController only campfire-hci-2 app
    if (appDescriptor["type"] == "simple_app") {
      appProcess = child_process.exec(`electron simpleLauncher.js ${index}`);

      // Run an external command to start an application
    } else if (appDescriptor["type"] == "external_app") {
      appProcess = child_process.spawn(
        appDescriptor["args"]["start_cmd"],
        [],
        {
          // Set child working directory from app descriptor if specified
          cwd: appDescriptor["args"]["start_dir"],
          shell: true
        }
      );
    } else {
      console.log(`ChildUtils: Invalid Application type: ${appDescriptor["type"]}`);
      return;
    }

    // Redirect child stdout/stderr to the js console
    appProcess.stdout.on('data', (data) => { console.log(`child stdout: ${data}`); });
    appProcess.stderr.on('data', (data) => { console.log(`child stderr: ${data}`); });

    // Add exit handler to remove reference to currently opened child on child close
    appProcess.on('exit', function (code, signal) {
      console.log(`ChildUtils: child exited with status ${code}`);
      RemoteClient.closeURL();
      global.childps.app = null;
    });
    
    // Assign childPS to variable
    global.childps.app = appProcess;
    console.log(`ChildUtils: App ${appDescriptor.name} open with PID ${global.childps.app.pid}`);
  },

  /*
    Terminates a child process if it exists
    @warn will fail if called outside of the main thread
  */
  closeApp: function () {
    console.log("ChildUtils: closeApp() Invoked... ");
    if (this.isChildOpen()) {
      console.log(`ChildUtils: Killing process ${global.childps.app.pid}`);
      // Use the kill command appropriate for the platform
      if (os.platform() == 'win32') {
        console.log("ChildUtils: Killing windows process...");
        child_process.exec(`TaskKill /PID ${global.childps.app.pid} /F /T`); // Kill the process
      } else {
        child_process.exec(`pkill -P ${global.childps.app.pid}`); // Kill the process
      }
      // This dereference also occurs in the event handler for child exit
      console.log(`ChildUtils: Clearing app with PID ${global.childps.app.pid}`);
      global.childps.app = null;
    }
  }
}