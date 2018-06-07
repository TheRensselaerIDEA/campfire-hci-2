'use strict';

var electron = require('electron');
const ChildUtils = require('../ChildUtils.js');

var appSelected = 0; // Default selection in system
const child_process = require('child_process');

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
        let selected = document.getElementById("app_"+currentIndex);
        selected.setAttribute('class', "list-group-item active");
      } else { // Other styling
        document.getElementById("app_"+currentIndex).setAttribute('class', "list-group-item");
      }
    }
  }
}

/*
  Generates the element for a list item with specified parameters
*/
function generateListElement(index, name, description) {
  // Create list container element
  let listContainer = document.createElement('a');
  listContainer.id = "app_" + index;
  // Bind event listeners to container
  listContainer.addEventListener("click", () => { ChildUtils.openApp(index); });
  listContainer.addEventListener("mouseover", () => { select(index); });
  // Create title element
  let title = document.createElement('h4');
  title.innerHTML = name;
  title.setAttribute('class', 'list-group-item-heading');
  // Create description element
  let desc = document.createElement('p');
  desc.innerHTML = description;
  desc.setAttribute('class', 'list-group-item-text');
  // Append children to listContainer and return element
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
    const currentIndex = appIndex; // Need a local copy so that event listener binds to right index
    var listItem = generateListElement(
      appIndex,
      ChildUtils.appList[appIndex]['name'],
      ChildUtils.appList[appIndex]['description']
    );
    // Add to list
    listDiv.appendChild(listItem);
  }
  select(0);
}

document.onkeydown = function(evt) {
  if (evt.keyCode == 40) {
    select(appSelected + 1);
  } else if (evt.keyCode == 38) {
    select(appSelected - 1);
  } else if (evt.keyCode == 32) {
    ChildUtils.openApp(appSelected);
  }
}
