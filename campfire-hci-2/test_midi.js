'use strict';
const MidiHandler = require('./MidiHandler.js');

console.log('Midi Test...');

console.log('Creating Midi object...');

// Create and start controller
var mh = new MidiHandler();

// Bind button
mh.bindButtonReleaseHandler(mh.BTN_CODE.BTN_01, (val) => {
    console.log("button pressed!");
});

// Stopping controller 
//mh.stop();
// Starting again
//mh.start();
