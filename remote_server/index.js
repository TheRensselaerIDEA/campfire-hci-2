const RemoteViewController = require('./RemoteViewController.js');
const http = require('http');
const httpServer = http.Server();
const electron = require('electron');

const PORT = 5000;
var viewController = null;


function openURL(url) {
    if (viewController != null) {
        viewController.openURL(url);
    } else {
        console.log("opening view controller...");
        viewController = new RemoteViewController({'url': url});
    }
}

function closeVC() {
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
            respData.error = 'URL is undefined'
        } else {
            openURL(req.headers.url);
        }
    } else if (req.headers.cmd == "close") {
        console.log("CMD Received: close")
        closeVC();
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
});

httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});