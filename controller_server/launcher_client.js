/**
 * Implementation of the Launcher HTTP API
 * 
 * Author: Antonio Fiol-Mahon
 */

const app_list = require('../launcher/appList.json');

module.exports = function LauncherClient(args) {

    // Load arguments
    this.ip = args['ip'];
    this.port = args['port'];


    /**
     * Fetch the appList object from the launcher
     */
    this.get_app_list = function() {
        return app_list;
    };
    

    /**
     * Requests that the launcher open the app at the specified index
     * @param {number} index The requested index to open, -1 to close app and show launcher
     * @returns The viewcode for the controller to open, -1 if app did not open
     */
    this.open_app = function(index) {
        // TODO: implement
        console.log(`LauncherClient: opening app at index ${index}`);
        let viewcode = index;
        return viewcode;
    };

}