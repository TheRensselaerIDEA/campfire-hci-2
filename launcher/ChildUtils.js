/*
  A set of utilities for managing a child process
*/
'use strict';

// Import Dependenciess
const child_process = require('child_process');
const os = require('os');

/*
  Thread agnostic way of retrieving the reference to the child process
  @return {Object} ChildProcess of launcher if any, else null
*/
function getChildPs() {
  try {
    return electron.remote.getGlobal('openApp')["app"];
  } catch (err) {
    return global.openApp["app"];
  }
}

/*
  Thread agnostic way of retrieving the reference to the child process
  @return {Object} ChildProcess of launcher if any, else null
*/
function setChildPs(newPS) {
  try {
    electron.remote.getGlobal('openApp')["app"] = newPS;
  } catch (err) {
    global.openApp["app"] = newPS;
  }
}

module.exports = {

  appList: require('./appList.json'),

  /*
    Opens the application at the specified index in appList
    // TODO eliminate warning
    @warn behavior of function undefined/untested if called outside of a renderer thread
    @param {number} index - the index of the application to open
  */
  openApp: function (index) {
    console.log("Opening " + this.appList[index].name);
    let appProcess = null;
    // If an app is open, close it
    // Ensure an app isnt already open
    if (getChildPs() != null) {
      this.killChildPs();
    }

    // Start a basic ViewController only campfire-hci-2 app
    if (this.appList[index]["type"] == "simple_app") {
      appProcess = child_process.exec("electron simpleLauncher.js " + index);
      // Run an external command to start an application
    } else if (this.appList[index]["type"] == "external_app") {

      let childWorkingDir = this.appList[index]['start_dir'];
 
      appProcess = child_process.spawn(
        this.appList[index]["start_cmd"],
        [],
        { 
          // Set child working directory from app descriptor if specified
          cwd: (childWorkingDir != null) ? childWorkingDir : null,
          shell: true 
        }
      );
    } else {
      console.log("Invalid Application type: " + this.appList[index]["type"]);
      return
    }

    // Add exit handler to remove reference to currently opened child on child close
    appProcess.on('exit', function (code, signal) {
      console.log("child exited with status " + code);
      setChildPs(null);
    });
    setChildPs(appProcess);
  },

  /*
    Terminates a child process if it exists
  */
  killChildPs: function () {
    console.log("attempting to kill ps " + getChildPs());
    if (getChildPs() != null) {
      console.log("Killing process " + getChildPs().pid);
      // Use the kill command appropriate for the platform
      if (os.platform() == 'win32') {
        console.log("Killing windows process...")
        child_process.exec('TaskKill /PID ' + getChildPs().pid + " /F /T"); // Kill the process
        //global.openApp['app'].kill("SIGKILL");
      } else {
        child_process.exec('pkill -P ' + getChildPs().pid); // Kill the process
      }
      // This also happens automatically in the event handler for child exit
      setChildPs(null);
    }
  }


}