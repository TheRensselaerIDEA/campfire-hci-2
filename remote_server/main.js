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
const path = require('path');

// Static Variable definitions
const PORT = 5000;
const SPLASH_URL = path.join('file://', __dirname, 'docs', 'splash.html');
const CONTEXT_URL = path.join('file://', __dirname, 'docs', 'context.html');

var contextViewController = null;
var splashViewController = null;

function handleRequest(req, res) {
    // Initialize Header
    let respData = {'success': true};
    res.writeHead(200, { 'Content-Type': 'application/json' });

    // Handle post commands
    if (req.headers.cmd == 'open') {
        console.log(`CMD Received: open`);
        console.log(req.headers);
        let ctx_url = req.headers.context_url;
        let spl_url = req.headers.splash_url;
        // Open any URLs defined in the HTTP request
        contextViewController.openURL((ctx_url == undefined) ? CONTEXT_URL:  ctx_url)
        splashViewController.openURL((spl_url == undefined) ? SPLASH_URL : spl_url)
    } else if (req.headers.cmd == 'close') {
        console.log("CMD Received: close");
        contextViewController.openURL(CONTEXT_URL);
        splashViewController.openURL(SPLASH_URL);
    } else {
        respData.success = false;
        respData.error = `Invalid command '${req.headers.cmd}'`;
        console.log(`ERROR: ${respData.error}`);
    }

    res.write(JSON.stringify(respData));
    res.end('\n');
}

// Initialize app and register request handler when electron is ready
electron.app.on('ready', () => {
    httpServer.on('request', handleRequest);

    contextViewController = new RemoteViewController({
        'url': CONTEXT_URL,
        'nodeIntegration': false,
        'primaryScreen': true
    });
    
    splashViewController = new RemoteViewController({
        'url': SPLASH_URL,
        'nodeIntegration': false,
        'primaryScreen': false
    });

});

// Start listening for requests
httpServer.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });