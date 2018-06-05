'use strict';

var electron = require('electron');
var appList = electron.remote.getGlobal('appList');
var appSelected = 0; // Default selection in system
const child_process = require('child_process');

/*
  Opens the application at the specified index in appList
*/
function openApp(index) {
  // Ensure an app isnt already open
  if (electron.remote.getGlobal('openApp')["app"] == null) {
    // Check path isn't empty before calling it
    if (appList[index]["path"].length > 0) {
      let appProcess = child_process.exec("electron " + appList[index]["path"]);
    }
    electron.remote.getGlobal('openApp')['app'] = appProcess;
    console.log("New process created with PID " + appProcess.pid);
  } else {
    console.log("app already open, cannot open new one");
  }
}

/*
  Updates selection and view
*/
function select(index) {
  //TODO check index is valid
  if (index < appList.length && index >= 0) {
    appSelected = index;
    console.log("Index " + appSelected + " has been selected");
    let appIndex;
    for (appIndex in appList) {
      let currentIndex = appIndex;
      // Apply stying based on if element is selected
      if (currentIndex == appSelected) { // Selected styling
        document.getElementById("app_"+currentIndex).setAttribute('class', "btn btn-success");
      } else { // Other styling
        document.getElementById("app_"+currentIndex).setAttribute('class', "btn btn-primary");
      }
    }
  }
}

/*
  Load the app list based off of the values from the main index.js
*/
function loadAppTable() {
  let appTable = document.getElementById('appTable');
  let appIndex;
  for (appIndex in appList) {
    let currentIndex = appIndex; // Need a local copy so that event listener binds to right index
    let row = appTable.insertRow(-1);
    let cell = row.insertCell(0);
    let btn = document.createElement("BUTTON");
    btn.className = "btn btn-light";
    btn.id = "app_"+appIndex;
    btn.innerHTML = appList[appIndex]["name"] + " @ index " + appIndex;
    btn.addEventListener("click", function() {
      openApp(currentIndex);
    });
    cell.appendChild(btn);
  }
  select(0);
}

document.onkeydown = function(evt) {
  if (evt.keyCode == 40) {
    select(appSelected + 1);
  } else if (evt.keyCode == 38) {
    select(appSelected - 1);
  } else if (evt.keyCode == 32) {
    openApp(appSelected);
  }
}
