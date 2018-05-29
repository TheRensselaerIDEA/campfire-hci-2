/*
  Simple Demonstration of creating a campfire application with wrangler
*/

const path = require("path");

const fileDir = 'file://' + __dirname

const floorImg = path.join(fileDir, 'images', 'target2.png')
const wallImg = path.join(fileDir, 'images', 'wall.png')

const args = {
  "fullscreen": true,
  "display": true,
  "screenWrap": true,
  "centermode": false,
  "floorURL": floorImg,
  "wallURL": wallImg
}

var demo_app = require('campfire-hci-2@1.0.1')(args);
