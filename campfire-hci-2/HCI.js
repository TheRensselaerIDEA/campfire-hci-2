const InputManager = require('./InputManager.js');
const ViewController = require('./ViewController.js');
const MouseListener = require('./MouseListener.js');
const electron = require('electron');


/**
 * Provides a top level state/context for the HCI features.
 * @param {Object} args - optional configuration arguments
 */
module.exports = function HCI (args) {

    /**
     * Read a value from the args object, or fallback to a default value if there is none
     * @param {string} key the key for the value to get in the args object
     * @param {*} default_val Value to use if key is not in the args object
     */
    this.getArg = function(key, default_val) {
        return (args[key] != undefined) ? args[key] : default_val;
    };

    // Initialize the HCI Modules
    this.viewController = new ViewController(args);
    this.inputManager = new InputManager();

    // Create the mouse listener if enabled
    // Must wait for electron to initialize
    electron.app.on('ready', () => {
        if (this.getArg('mousewrangler', true)) {
            this.mouseListener = new MouseListener(
                this.viewController.floorScreen.bounds,
                this.viewController.wallScreen.bounds,
                this.getArg('screenWrap', true),
                this.getArg('centermode', true)
            );
        }
    });
}