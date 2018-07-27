/**
 * RemoteClient.js
 * 
 * Provides an interface to access functionality on Remote Server over the network
 * 
 * Author: Antonio Fiol-Mahon
 */

 'use strict';

const request = require('request');

var SERVER_URL = 'http://128.113.130.179:5000/';
// var SERVER_URL = 'http://127.0.0.1:5000/';

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
