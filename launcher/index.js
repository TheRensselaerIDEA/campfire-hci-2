/*
  Author: Antonio Fiol-Mahon
*/

const path = require('path')
const ViewController = require('campfire-hci-2');
const electron = require('electron');

const docRoot = path.join('file://', __dirname, 'docs');
const floorURL = path.join(docRoot, 'floor.html');
const wallURL = path.join(docRoot, 'wall.html');

var view = ViewController({
  "fullscreen": false,
  "display": true,
  "screenWrap": true,
  "centermode": false,
  "floorURL": floorURL,
  "wallURL": wallURL
});

var apps = ["App 1", "App 2", "App 3"];


global.appList = apps;
