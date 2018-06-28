/**
 * View controller for remote view server
 * Created by Antonio Fiol-Mahon
 */

const electron = require('electron');

module.exports = function RemoteViewController(args) {

    const BG_COLOR = '#21252b';

    /**
     * Get an argument or its default value
     * @param {String} key argument key
     * @param {*} default_val fallback value if args does not define key
     */
    this.getArg = function(key, default_val) {
        return (args[key] != undefined) ? args[key] : default_val;
    };


    this.init = function() {
        this.screen = electron.screen.getPrimaryDisplay();
        this.window = new electron.BrowserWindow({
            show: true,
            frame: false,
            backgroundColor: BG_COLOR,
            fullscreen: this.getArg('fullscreen', true),
            webPreferences:{nodeIntegration: this.getArg('nodeIntegration', true)}
        });

        // Load Page if a URL is provided
        let url = this.getArg('url', null);
        this.openURL(url);
    };

    this.openURL = function(url) {
        if (url != null) {
            this.window.loadURL(url);
            this.window.show();
            console.log(`Opened URL '${url}'`);
        }
    };

    this.close = function() {
        this.window.close();
    };

    this.init();
}