/**
 * A set of utilities for managing a child process
 */
'use strict';
const child_process = require('child_process');
const os = require('os');

module.exports = {

  appList: require('./appList.json'),
  childPS: null,

  /*
    Opens the application at the specified index in appList
    @warn - will fail if called outside of the main thread
    @param {number} index - the index of the application to open
  */
  openApp: function (index) {
    console.log(`Opening ${this.appList[index].name}`);
    let appProcess = null;
    // If an app is open, close it
    // Ensure an app isnt already open
    if (this.childPS != null) {
      this.killChildPs();
    }

    // Start a basic ViewController only campfire-hci-2 app
    if (this.appList[index]["type"] == "simple_app") {
      appProcess = child_process.exec(`electron simpleLauncher.js ${index}`);
      console.log(`App opened, value is ${appProcess}`);
      // Run an external command to start an application
    } else if (this.appList[index]["type"] == "external_app") {
      let childWorkingDir = this.appList[index]["args"]["start_dir"];
      appProcess = child_process.spawn(
        this.appList[index]["args"]["start_cmd"],
        [],
        { 
          // Set child working directory from app descriptor if specified
          cwd: (childWorkingDir != null) ? childWorkingDir : null,
          shell: true 
        }
      );
    } else {
      console.log(`Invalid Application type: ${this.appList[index]["type"]}`);
      return
    }
    appProcess.stdout.on('data', (data) => {
      console.log(`child stdout: ${data}`);
    });
    appProcess.stderr.on('data', (data) => {
      console.log(`child stderr: ${data}`);
    });

    // Add exit handler to remove reference to currently opened child on child close
    appProcess.on('exit', function (code, signal) {
      console.log(`child exited with status ${code}`);
      this.childPS = null;
    });
    this.childPS = appProcess;
  },

  /*
    Terminates a child process if it exists
    @warn will fail if called outside of the main thread
  */
  killChildPs: function () {
    console.log(`Attempting to kill ps ${this.childPS}`);
    if (this.childPS != null) {
      console.log(`Killing process ${this.childPS.pid}`);
      // Use the kill command appropriate for the platform
      if (os.platform() == 'win32') {
        console.log("Killing windows process...")
        child_process.exec(`TaskKill /PID ${this.childPS.pid} /F /T`); // Kill the process
      } else {
        child_process.exec(`pkill -P ${this.childPS.pid}`); // Kill the process
      }
      // This also happens automatically in the event handler for child exit
      this.childPS = null;
    }
  }
}