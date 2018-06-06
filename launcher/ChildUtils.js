/*
  A set of utilities for managing a child process
*/

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
  } catch(err) {
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
  } catch(err) {
    global.openApp["app"] = newPS;
  }
}

module.exports = {

  /*
    Opens the application at the specified index in appList
    @warn This should only be called from client
    @param {number} index - the index of the application to open
  */
  openApp: function(index) {

    // If an app is open, close it
    // Ensure an app isnt already open
    if (getChildPs() != null) {
      this.killChildPs();
    }
    // Check path to child process isn't empty before opening
    if (appList[index]["path"].length > 0) {
      let appProcess = child_process.exec("electron " + appList[index]["path"]);
      appProcess.on('exit', function (code, signal) {
        setChildPs(null);
      });
      setChildPs(appProcess);
    }

  },

  /*
    Terminates a child process if it exists
  */
  killChildPs: function() {
    console.log("attempting to kill ps "+getChildPs());
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
