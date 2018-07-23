/**
 * floor.js
 * 
 * Javascript code executed by renderer thread on floor window
 * Binds HTML interface to main thread functionality
 * 
 * Author: Antonio Fiol-Mahon
 */

'use strict';

const electron = require('electron');
const ChildUtils = require('../ChildUtils.js');

// Current selection in appList
var appSelected = 0;

// Defines the styling used for each app group
var group_style = {
  default: {
    class_selected: "",
    color: "#ffffff",
    title: ""
  },
  classic: {
    class_selected: "list-group-item-success",
    color: "#28a745;",
    title: "Classic"
  },
  science: {
    class_selected: "active",
    color: "#007aff;",
    title: "Science"
  },
  summer2018: {
    class_selected: "list-group-item-warning",
    color: "#ffc108;",
    title: "Summer 2018"
  },
  hacks: {
    class_selected: "list-group-item-danger",
    color: "#dc3645;",
    title: "Hack"
  }
}

const CLASS_CONTAINER = "list-group-item list-group-item-action flex-column align-items-start";

/**
 * Syles the list element corresponding to the appDescriptor in ChildUtils.appList at index
 * @param {number} index - index of the app in ChildUtils.appList to style
 */
function styleElement(index) {
  // Get the group or use default
  let category = (ChildUtils.appList[index].group != undefined) ? ChildUtils.appList[index].group : 'default';
  // Get the element for the app at index
  let el = document.getElementById(`app_${index}`);
  if (index == appSelected) {
    el.setAttribute('class', CLASS_CONTAINER + ` ${group_style[category].class_selected}`);
  } else {
    el.setAttribute('class', CLASS_CONTAINER);
    el.setAttribute('style', `border-left: 10px solid ${group_style[category].color}`);
  }
}

/**
 * Updates the styling for all list elements and the selected app variable
 * @param {*} index - index of app that is being selected
 */
function select(index) {
  if (index < ChildUtils.appList.length && index >= 0) {
    appSelected = index;
    console.log(`Index ${appSelected} has been selected`);
    let appIndex;
    for (appIndex in ChildUtils.appList) {
      styleElement(appIndex);
    }
  }
}

/**
 * Creates the list element for the app descriptor at the specified index
 * @param {*} index - app descriptor index to use for populating list element fields
 */
function generateListElement(index) {
  // Create list container element & add event listeners
  let listContainer = document.createElement('a');
  listContainer.id = "app_" + index;
  listContainer.addEventListener("click", () => { openApp(index); });
  listContainer.addEventListener("mouseover", () => { select(index); });
  listContainer.setAttribute('class', CLASS_CONTAINER);

  // Create title display div
  let divTitle = document.createElement('div');
  divTitle.setAttribute('class', 'd-flex w-100 justify-content-between');

  // Create Title element
  let title = document.createElement('h5');
  title.setAttribute('class', 'mb-1');
  title.innerHTML = ChildUtils.appList[index]['name'];

  // Create Category label element
  let categoryLabel = document.createElement('small');
  let category = (ChildUtils.appList[index].group != undefined) ? ChildUtils.appList[index].group : 'default';
  categoryLabel.innerHTML = group_style[category].title;

  // Create description element
  let desc = document.createElement('p');
  desc.innerHTML = ChildUtils.appList[index]['description'];
  desc.setAttribute('class', 'mb-1');

  // Build heirarchy and return element
  divTitle.appendChild(title);
  divTitle.appendChild(categoryLabel);
  listContainer.appendChild(divTitle);
  listContainer.appendChild(desc);
  return listContainer;
}

/*
  Load the list of available apps based off of the app descriptors defined in appList.json
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

/**
 * Call ChildUtils in the main thread and open the desired application
 */
function openApp(appIndex) {
  electron.ipcRenderer.send('open-app', appIndex);
}

// Code below is run when script is loaded

loadAppTable();

// Check for keypress events from main electron thread
electron.ipcRenderer.on('keyevent', function(event, arg) {
  console.log("Key event detected!");
  if (arg == 'up') {
    select(appSelected + 1);
    if (appSelected >= 4) {
      let el = document.getElementById(`app_${appSelected}`);
      document.getElementById('listDiv').scrollTop += el.clientHeight;
    }
  } else if (arg == 'down') {
    select(appSelected - 1);
    if (appSelected <= ChildUtils.appList.length - 5) {
      let el = document.getElementById(`app_${appSelected}`);
      document.getElementById('listDiv').scrollTop -= el.clientHeight;
    }
  } else if (arg == 'select') {
    openApp(appSelected);
  }
});

// This will break if appList exceeds 127 entries
electron.ipcRenderer.on('selectEvent', function(event, arg) {
  select(arg%ChildUtils.appList.length);
});

electron.ipcRenderer.on('rotate-event', function(event, rotation) {
  document.getElementById('owner').setAttribute('style', `transform: rotate(${rotation}deg); transform-origin: 50% 50%;transition-duration:100ms;`);
});
