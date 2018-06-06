/*
  Utility class to facilitate consistent binding to campfire input devices
*/

'use strict';

const electron = require('electron');

module.exports = function InputController() {
  this.menu = new electron.Menu();

  this.bindSelect = function (action) {
    this.menu.append(new electron.MenuItem({
      label: "Select",
      accelerator: "space",
      click: action
    }));
  };

  this.bindClockwise = function(action) {
    this.menu.append(new electron.MenuItem({
      label: "Rotate Clockwise",
      accelerator: "down",
      click: action
    }));
  };

  this.bindCounterClockwise = function(action) {
    this.menu.append(new electron.MenuItem({
      label: "Rotate CounterClockwise",
      accelerator: "up",
      click: action
    }));
  };

}
