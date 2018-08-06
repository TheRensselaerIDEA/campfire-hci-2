/**
 * RemoteClient.js
 * 
 * Provides an interface to access functionality on Remote Server over the network
 * 
 * Author: Antonio Fiol-Mahon
 */

 'use strict';

const request = require('request');

try {
    var settings = require('./settings.json');
} catch(err) {
    var settings = {
        "remote_ip": "127.0.0.1"
    };
}

//const SERVER_IP = '128.113.130.179';
const SERVER_IP = settings.remote_ip;
const SERVER_PORT = 5000;

const SERVER_URL = `http://${SERVER_IP}:${SERVER_PORT}/`;

module.exports = {
    /**
     * Send server request to open the specified URL
     * @param {string} context_url - URL to open in remote view controller context monitor
     * @param {string} splash_url - URL to open in remote view controller splash monitor
     */
    openURL: function (context_url, splash_url) {
        console.log(`Remote client with args ${context_url}, ${splash_url}`)
        let options = {
            method: 'GET',
            headers: {
                'User-Agent': 'request',
                'cmd': 'open',
                'context_url': context_url,
                'splash_url': splash_url
            }
        };
        request(SERVER_URL, options, null).on('error', function(err) {
            console.log(`remote_server request failed: "${err}"`);
        });
    },

    /**
     * Close remote view controller display
     */
    closeURL: function() {
        console.log("RemoteClient: Closing Remote Page");
        let options = {
            method: 'GET',
            headers: {
                'User-Agent': 'request',
                'cmd': 'close',
            }
        };
        request(SERVER_URL, options, null).on('error', function(err) {
            console.log(`remote_server request failed: "${err}"`);
        });
    }
}
