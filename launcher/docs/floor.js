'use strict';

const electron = require('electron');
const child_process = require('child_process');
const ChildUtils = require('../ChildUtils.js');

var appSelected = 0; // Default selection in system

/**
 * Conveneient setter for element text and backgorund colors, for recoloring buttons
 *
 * @param {Object} element - listElement to color, works with element returned from generateListElement()
 * @param {String} bgColor - a hex color string, sets background color
 * @param {String} nameColor - a hex color string, sets name text color
 * @param {String} descColor - a hex color string, sets description text color
 */
function setElementColors(element, bgColor, nameColor, descColor) {
  element.setAttribute('style', "background-color:" + bgColor + ";")
}

/*
  Updates selection and view
*/
function select(index) {
  //TODO check index is valid
  if (index < ChildUtils.appList.length && index >= 0) {
    appSelected = index;
    console.log("Index " + appSelected + " has been selected");
    let appIndex;
    for (appIndex in ChildUtils.appList) {
      let currentIndex = appIndex;
      // Apply stying based on if element is selected
      if (currentIndex == appSelected) { // Selected styling
        let selected = document.getElementById("app_" + currentIndex);
        selected.setAttribute('class', "list-group-item active");
      } else { // Other styling
        document.getElementById("app_" + currentIndex).setAttribute('class', "list-group-item");
      }
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

/*
  Handle input events for the webpage while in focus
*/
// document.onkeydown = function(evt) {
//   if (evt.keyCode == 40) {
//     select(appSelected + 1);
//   } else if (evt.keyCode == 38) {
//     select(appSelected - 1);
//   } else if (evt.keyCode == 32) {
//     ChildUtils.openApp(appSelected);
//   }
// }

// Bind actions to viewcontroller input manager
console.log("binding keybord event handlers..")
const im = require('../InputManager.js');

electron.remote.app.on('ready', () => {
  console.log("Electron ready, binding keyboard commands to input manager...")
  im.bindForward(() => {
    console.log("IM: Forward");
    select(appSelected + 1);
  });
  
  im.bindBackward(() => {
    console.log("IM: Back");
    select(appSelected - 1);
  });
  
  im.bindSelect(() => {
    console.log("IM: Select");
    ChildUtils.openApp(appSelected);
  });
});
