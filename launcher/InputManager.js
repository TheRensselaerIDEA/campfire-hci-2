const electron = require('electron');

/**
 * Defines the InputManager class
 * WARNING: Calls to this class must be made after electron is ready, calls before may cause errors. To protect against this, enclose uses in electron.app.on('ready', () => { usage here })
 */
module.exports = {
    
    // Keyboard Accelerator Definitions
    FORWARD_ACCELERATOR: "F6",
    BACKWARD_ACCELERATOR:"F7",
    SELECT_ACCELERATOR: "F8",

    bindForward: function (handler) {
        electron.globalShortcut.register(FORWARD_ACCELERATOR, handler);
    },

    bindBackward: function (handler) {
        electron.globalShortcut.register(BACKWARD_ACCELERATOR, handler);
    },

    bindSelect: function (handler) {
        electron.globalShortcut.register(SELECT_ACCELERATOR, handler);
    }
}