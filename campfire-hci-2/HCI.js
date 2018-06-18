const InputManager = require('./InputManager.js');
const ViewController = require('./ViewController.js');
const MouseListener = require('./MouseListener.js');
const electron = require('electron');

/**
 * Provides a top level state/context for the HCI features.
 * @param {Object} args - optional configuration arguments
 */
module.exports = function HCI (args) {

    /*
    Simplify argument reading and allow default values for ommitted args
    */
    this.getArg = function(key, default_val) {
        return (args[key] != undefined) ? args[key] : default_val;
    };

    // Create the view controller
    this.viewController = new ViewController(args);

    // Create the input manager
    this.inputManager = new InputManager();

    // Create the mouse listener if enabled
    // Must wait for electron to initialize
    electron.app.on('ready', () => {
        if (this.getArg('mousewrangler', true)) {
            this.mouseListener = new MouseListener(
                this.viewController.floorScreen,
                this.viewController.wallScreen,
                this.getArg('screenWrap', true),
                this.getArg('centermode', true),
                this.getArg('debugEnabled', false)
            );
        }
    });
    
}