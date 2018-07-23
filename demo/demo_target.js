/**
 * demo_target.js
 * 
 * Example of a barebones campfire-hci-2 application
 * 
 * Author: Antonio Fiol-Mahon
 */

'use strict';

const path = require("path");
const HCI = require("../campfire-hci-2");
const electron = require('electron');

const FILE_DIR = 'file://' + __dirname;
const FLOOR_URL = path.join(FILE_DIR, 'images', 'target2_invert.png');
const WALL_URL = path.join(FILE_DIR, 'images', 'wall_invert.png');

var demoApp = new HCI({
  "fullscreen": true,
  "display": true,
  "screenWrap": true,
  "centermode": false,
  "floorURL": FLOOR_URL,
  "wallURL": WALL_URL,
  "mousewrangler": true
});