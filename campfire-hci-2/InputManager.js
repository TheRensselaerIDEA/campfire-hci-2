const electron = require('electron');

/**
 * Defines the InputManager class
 */
module.exports = function InputManager() {
    
    // Keyboard Accelerator Definitions
    const BACKWARD_ACCELERATOR = "F6";
    const FORWARD_ACCELERATOR = "F7";
    const SELECT_ACCELERATOR = "F8";
    const BACKWARD_ACCEL_ALT = "UP";
    const FORWARD_ACCEL_ALT = "DOWN";
    
    /**
     * Binds a function to the specified accelerator, allows way binding is handled to be changed centrally
     * @param {string} accel - Electron shortcut accelerator, see electron API docs for valid values
     * @param {function} handler - Tshe function to invoke when the event occurs
     */
    this.bind = function(accel, handler) {
        // Invoking globalShortcut.register before electron is ready will crash the application
        electron.app.on("ready", () => {
            electron.globalShortcut.register(accel, handler);   // Register the shortcut handler
        });
    };

    /**
     * Bind a handler to a "forward" navigation action
     * @param {function} handler - handler that is invoked when the forward action occurs
     */
    this.bindForward = function (handler) {
        this.bind(FORWARD_ACCELERATOR, handler);
        this.bind(FORWARD_ACCEL_ALT, handler);
    };

    /**
     * Bind a handler to a "backward" navigation action
     * @param {function} handler - handler that is invoked when the backward action occurs
     */
    this.bindBackward = function (handler) {
        this.bind(BACKWARD_ACCELERATOR, handler);
        this.bind(BACKWARD_ACCEL_ALT, handler);
    };
    
    /**
     * Bind a handler to a "select" navigation action
     * @param {function} handler - handler that is invoked when the select action occurs
     */
    this.bindSelect = function (handler) {
        this.bind(SELECT_ACCELERATOR, handler);
    };
}

