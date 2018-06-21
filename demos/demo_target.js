/**
 * Example of a barebones campfire-hci-2 application
 */

const path = require("path");
const HCI = require("campfire-hci-2");
const electron = require('electron');

const fileDir = 'file://' + __dirname;
const floorURL = path.join(fileDir, 'images', 'target2_invert.png');
const wallURL = path.join(fileDir, 'images', 'wall_invert.png');

var demoApp = new HCI({
  "fullscreen": true,
  "display": true,
  "screenWrap": true,
  "centermode": false,
  "floorURL": floorURL,
  "wallURL": wallURL,
  "mousewrangler": true
});

demoApp.inputManager.midiH.bindKnobHandler(
  demoApp.inputManager.midiH.KNOB_CODE.LEVEL_RATE,
  (pos) => {
    console.log(`my midi LEVEL/RATE knob position is ${pos}!`);
  }
);