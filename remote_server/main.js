/**
 * main.js
 * 
 * Entry Point/Business logic for launcher remote server
 * 
 * Author: Antonio Fiol-Mahon
 */

// Imports
const RemoteViewController = require('./RemoteViewController.js');
const http = require('http');
const httpServer = http.Server();
const electron = require('electron');
const path = require('path')

// Static Variable definitions
const PORT = 5000;
const SPLASH_URL = path.join('file://', __dirname, 'docs', 'splash.html');

var viewController = null;

function closeURL() {
    if (viewController != null) {
        console.log("Closing ViewController...");
        viewController.close();
        viewController = null;
    }
}

function handleRequest(req, res) {
    // Initialize Header
    let respData = {'success': true};
    res.writeHead(200, { 'Content-Type': 'application/json' });

    // Handle post commands
    if (req.headers.cmd == "open") {
        console.log("CMD Received: open");
        if (req.headers.url == undefined) {
            respData.success = false;
            respData.error = 'URL is undefined';
        } else {
            viewController.openURL(req.headers.url);
        }
    } else if (req.headers.cmd == "close") {
        console.log("CMD Received: close");
        viewController.openURL(SPLASH_URL);
    } else {
        respData.success = false;
        respData.error = `Invalid command '${req.headers.cmd}'`;
        console.log(`ERROR: ${respData.error}`);
    }

    res.write(JSON.stringify(respData));
    res.end('\n');
}

// Initialize app and register request handler
electron.app.on('ready', () => {
    httpServer.on('request', handleRequest);
    viewController = new RemoteViewController({'url': SPLASH_URL, 'nodeIntegration': false});
});

httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});