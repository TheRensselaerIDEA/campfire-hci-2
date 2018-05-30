/*
  Author: Tommy Fang
  Modified: Antonio Fiol-Mahon
  Date: 3/20/2018
  Advisors: Professors Jim Hendler and John Erickson
  Rensselaer Polytechnic Institute Master's Project Spring 2018

  This is an example JavaScript file for launching the mouse wrangler utility.
  If mouse wrangler needs to be installed on a new Campfire computer, then follow these instructions.
  1. Ensure Electron/Node are installed.
  2. Follow the installation guide in the documentation.
  3. Modify parameters below
  4. type "electron ." in cmd.exe

  Please see slides/documentation in repository for references on figures which are crucial
  in explaining the logic behind this architecture.


Examples of inputs for parameters.
  "floorURL": 'http://bit.ly/CampfireFloorSlide'
  "wallURL": 'http://bit.ly/CampfireWallSlide'
  var exampleFileURL = 'file://' + __dirname + '/images/wall_invert.png'
  "floorURL": exampleFileURL
*/
'use strict';

// Imports
const electron = require('electron');
const ViewController = require('./ViewController.js')

module.exports = function(args) {

  var viewController = new ViewController(args);

  electron.app.on('ready', function() {
    viewController.init()
  });
  return viewController;
}
