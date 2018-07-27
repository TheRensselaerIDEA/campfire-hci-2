/**
 * RemoteViewController.js
 * 
 * Simple view controller for displaying content from the main campfire applcation
 * 
 * Author: Antonio Fiol-Mahon
 */

const electron = require('electron');

module.exports = function RemoteViewController(args) {

    const BG_COLOR = '#21252b';

    /**
     * Get an argument or its default value
     * @param {string} key argument key
     * @param {*} default_val fallback value if args does not define key
     */
    this.getArg = function(key, default_val) {
        return (args[key] != undefined) ? args[key] : default_val;
    };

    /**
     * Initialize the vc browser window with specified preferences
     * @param {boolean} is_fullscreen set window fullscreen
     * @param {boolean} is_node_integration enable/disable node integration, can interfere with some webapps
     * @param {boolean} primary_screen true for primary display, false for secondary display
     */
    this.init = function(is_fullscreen, is_node_integration, primary_screen) {

        // Determine display to use
        let display_list = electron.screen.getAllDisplays();
        this.screen = (display_list.length > 1 && !primary_screen) ? display_list[1] : display_list[0];
        
        // Initialize BrowserWindow with preferences
        this.window = new electron.BrowserWindow({
            x: this.screen.bounds.x,
            y: this.screen.bounds.y,
            width: this.screen.bounds.width,
            height: this.screen.bounds.height,
            show: true,
            frame: false,
            backgroundColor: BG_COLOR,
            fullscreen: is_fullscreen,
            webPreferences:{nodeIntegration: is_node_integration}
        });
    };

    /**
     * Opens a URL in the viewcontroller window if it is valid, can be online/local
     * @param {string} url Link for resource to display
     */
    this.openURL = function(url) {
        if (typeof(url) == 'string') {
            this.window.loadURL(url);
            this.window.show();
            console.log(`Opened URL '${url}'`);
        } else {
            console.log(`Invalid URL '${url}'`)
        }
    };

    this.closeVC = function() {
        this.window.close();
    };

    
    // Load optional arguments
    let is_fullscreen = this.getArg('fullscreen', true);
    let is_node_integration = this.getArg('nodeIntegration', true);
    let is_primary_screen = this.getArg('primaryScreen', true);
    let display_url = this.getArg('url', null);

    // Create window and open URL
    this.init(is_fullscreen, is_node_integration, is_primary_screen);
    this.openURL(display_url);
}