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

// Defines the styling used for each app group
const GROUP_STYLES = {
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

var launcher_apps = []; // Data for apps currently visible in launcher
var app_selected = 0; // Current selection in appList

/**
 * Syles the list element corresponding to the appDescriptor in apps at index
 * @param {number} index - index of the app in apps to style
 * @param {number} index_selected - the currently selected list index
 * @param {*} group - grop to style element with
 */
function styleElement(index, index_selected, group) {
  // Use default if group is undefined
  if (group == undefined) { group = 'default'; }
  // Get the element for the app at index
  let el = document.getElementById(`app_${index}`);
  if (index == index_selected) {
    el.setAttribute('class', CLASS_CONTAINER + ` ${GROUP_STYLES[group].class_selected}`);
  } else {
    el.setAttribute('class', CLASS_CONTAINER);
    el.setAttribute('style', `border-left: 10px solid ${GROUP_STYLES[group].color}`);
  }
}

/**
 * Updates the styling for all list elements and the selected app variable
 * @param {*} index - index of app that is being selected
 */
function select(index) {
  if (index < launcher_apps.length && index >= 0) {
    app_selected = index;
    console.log(`Index ${app_selected} has been selected`);
    let i;
    for (i in launcher_apps) {
      styleElement(i, app_selected, launcher_apps[i]['group']);
    }
  }
}

/**
 * Creates the list element for the app descriptor at the specified index
 * @param {*} view_index - index of element in view
 * @param {str} name - app display name
 * @param {str} description - app display description
 * @param {str} group - the app group name string in GROUP_STYLES, determines element styling
 * @param {number} desc_index - index in app descriptor of app to open
 * @returns the DOM element constructed with the provided parameters
 */
function generateListElement(view_index, name, description, group, desc_index) {
  // Create list container element & add event listeners
  let listContainer = document.createElement('a');
  listContainer.id = "app_" + view_index;
  listContainer.addEventListener("click", () => { openApp(desc_index); });
  listContainer.addEventListener("mouseover", () => { select(view_index); });
  listContainer.setAttribute('class', CLASS_CONTAINER);

  // Create title display div
  let divTitle = document.createElement('div');
  divTitle.setAttribute('class', 'd-flex w-100 justify-content-between');

  // Create Title element
  let title = document.createElement('h5');
  title.setAttribute('class', 'mb-1');
  title.innerHTML = name;

  // Create Category label element
  let categoryLabel = document.createElement('small');
  let category = (group != undefined) ? group : 'default';
  categoryLabel.innerHTML = GROUP_STYLES[category].title;

  // Create description element
  let desc = document.createElement('p');
  desc.innerHTML = description;
  desc.setAttribute('class', 'mb-1');

  // Build heirarchy and return element
  divTitle.appendChild(title);
  divTitle.appendChild(categoryLabel);
  listContainer.appendChild(divTitle);
  listContainer.appendChild(desc);
  return listContainer;
}

/**
 * Populate a div container with the provided applist
 * @param {*} list_div the html div element that will hold the list
 * @param {*} app_list the full list of apps to load
 */
function loadAppTable(list_div, app_list, is_demo_mode) {
  let i;
  for (i in app_list) {
    let demoable = app_list[i]['demoable'] != undefined ? app_list[i]['demoable'] : true;
    if (!is_demo_mode || (is_demo_mode && demoable)) {
      // Add item to launcher apps and generate an element
      let list_index = launcher_apps.push(app_list[i]) - 1;
      var list_item = generateListElement(list_index, app_list[i]['name'], 
        app_list[i]['description'], app_list[i]['group'], i
      );
      list_div.appendChild(list_item);
    }
  }
  select(0);
}

/**
 * Call the main thread to open the desired application
 * @param {number} app_descriptor_index index of app in appList.json to open
 */
function openApp(app_descriptor_index) {
  electron.ipcRenderer.send('open-app', app_descriptor_index);
}

// Code below is run when script is loaded

// Get most recent appList from main launcher thread and render app table
var full_applist = electron.ipcRenderer.sendSync('applist-load', undefined); // All applications
var demo_mode = electron.ipcRenderer.sendSync('is-demo-mode', undefined);
console.log(`Demo Mode: ${demo_mode}`);
loadAppTable(document.getElementById('listDiv'), full_applist, demo_mode);

// Check for keypress events from main electron thread
electron.ipcRenderer.on('keyevent', function(event, arg) {
  console.log("Key event detected!");
  if (arg == 'up') {
    select(app_selected + 1);
    if (app_selected >= 4) {
      let el = document.getElementById(`app_${app_selected}`);
      document.getElementById('listDiv').scrollTop += el.clientHeight;
    }
  } else if (arg == 'down') {
    select(app_selected - 1);
    if (app_selected <= apps.length - 5) {
      let el = document.getElementById(`app_${app_selected}`);
      document.getElementById('listDiv').scrollTop -= el.clientHeight;
    }
  } else if (arg == 'select') {
    openApp(app_selected);
  }
});

// Rotate the UI orientation when rotation events are received
electron.ipcRenderer.on('rotate-event', function(event, rotation) {
  document.getElementById('owner').setAttribute('style', `transform: rotate(${rotation}deg); transform-origin: 50% 50%;transition-duration:100ms;`);
});
