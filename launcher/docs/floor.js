'use strict';

var electron = require('electron');
var appList = electron.remote.getGlobal('appList');
const child_process = require('child_process');

/*
  Opens the application at the specified index in appList
*/
function openApp(index) {
  if (electron.remote.getGlobal('openApp')["pid"] == null) {
    let appProcess = child_process.exec("electron " + appList[index]["path"]);
    electron.remote.getGlobal('openApp')['pid'] = appProcess.pid;
  } else {
    document.getElementById('display').innerHTML = "Can't open a new app now"
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
    btn.setAttribute("id", "app_"+appIndex)
    btn.innerHTML = appList[appIndex]["name"] + " @ index " + appIndex;
    btn.addEventListener("click", function() {
      openApp(currentIndex);
    });
    cell.appendChild(btn);
  }
}
