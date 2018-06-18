const electron = require('electron');
//const MidiHandler = require('./MidiHandler.js')
/**
 * Defines the InputManager class
 * WARNING: Calls to this class must be made after electron is ready, calls before may cause errors. To protect against this, enclose uses in electron.app.on('ready', () => { usage here })
 */
module.exports = function InputManager() {
    
    // Keyboard Accelerator Definitions
    const BACKWARD_ACCELERATOR = "F6";
    const FORWARD_ACCELERATOR = "F7";
    const SELECT_ACCELERATOR = "F8";

    //this.midiH = new MidiHandler();

    /**
     * Binds a function to the specified accelerator, allows way binding is handled to be changed centrally
     * @param {string} accel 
     * @param {function} handler 
     */
    this.bind = function(accel, handler) {
        electron.globalShortcut.register(accel, handler);
    };

    this.bindForward = function (handler) {
        this.bind(FORWARD_ACCELERATOR, handler);
    };

    this.bindBackward = function (handler) {
        this.bind(BACKWARD_ACCELERATOR, handler);
    };
    
    this.bindSelect = function (handler) {
        this.bind(SELECT_ACCELERATOR, handler);
    };

    this.bindMidiSpin = function (handler) {
        console.log('empty!');
    }
}

