'use strict';

const electron = require('electron');
const child_process = require('child_process');
const ChildUtils = require('../ChildUtils.js');

var ipcRenderer = electron.ipcRenderer;

var appSelected = 0; // Default selection in system


var class_select = [
  "list-group-item active",
  "list-group-item list-group-item-success",
  "list-group-item list-group-item-danger",
  "list-group-item list-group-item-warning",
  "list-group-item list-group-item-info"
]

var style_unselect = [
  "border-left: 10px solid blue;",
  "border-left: 10px solid green;",
  "border-left: 10px solid red;",
  "border-left: 10px solid yellow;",
  "border-left: 10px solid cyan;"
]

function styleElement(index, category) {
  let el = document.getElementById(`app_${index}`);
  console.log(`Styling ${index}`)
  if (index == appSelected) {
    el.setAttribute('class', class_select[category]);
    el.scrollIntoView();
  } else {
    el.setAttribute('class', "list-group-item");
    el.setAttribute('style', style_unselect[category]);
  }
}

/*
  Updates selection and view
*/
function select(index) {
  //TODO check index is valid
  if (index < ChildUtils.appList.length && index >= 0) {
    appSelected = index;
    console.log(`Index ${appSelected} has been selected`);
    let appIndex;
    for (appIndex in ChildUtils.appList) {
      styleElement(appIndex, appIndex%5);
    }
  }
}

/*
  Generates the element for a list item with specified parameters
*/
function generateListElement(index) {
  // Create list container element & add event listeners
  let listContainer = document.createElement('a');
  listContainer.id = "app_" + index;
  listContainer.addEventListener("click", () => { ChildUtils.openApp(index); });
  listContainer.addEventListener("mouseover", () => { select(index); });

  // Create title element
  let title = document.createElement('h4');
  title.innerHTML = ChildUtils.appList[index]['name'];
  title.setAttribute('class', 'list-group-item-heading');

  // Create description element
  let desc = document.createElement('p');
  desc.innerHTML = ChildUtils.appList[index]['description'];
  desc.setAttribute('class', 'list-group-item-text');

  // Add children and return element
  listContainer.appendChild(title);
  listContainer.appendChild(desc);
  return listContainer;
}

/*
  Load the app list based off of the values from the main index.js
*/
function loadAppTable() {
  let listDiv = document.getElementById('listDiv');
  let appIndex;
  for (appIndex in ChildUtils.appList) {
    var listItem = generateListElement(appIndex);
    // Add to list
    listDiv.appendChild(listItem);
  }
  select(0);
}

// Check for keypress events from main electron hread
ipcRenderer.on('keyevent', function(event, arg) {
  console.log("Key event detected!");
  if (arg == 'up') {
    select(appSelected + 1);
  } else if (arg == 'down') {
    select(appSelected - 1);
  } else if (arg == 'select') {
    ChildUtils.openApp(appSelected);
  }
});

// This will break if appList exceeds 127 entries
ipcRenderer.on('selectEvent', function(event, arg) {
  select(arg%ChildUtils.appList.length);
});