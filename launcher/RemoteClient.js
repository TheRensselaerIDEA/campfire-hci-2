/**
 * RemoteClient.js
 * 
 * Provides an interface to access functionality on Remote Server over the network
 * 
 * Author: Antonio Fiol-Mahon
 */

 'use strict';

const request = require('request');
const config = require('./config.js');
const REMOTE_IP = config.getSettings().remote_ip;
const REMOTE_PORT = config.getSettings().remote_port;

module.exports = {

    server_url: `http://${REMOTE_IP}:${REMOTE_PORT}/`,

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
        request(this.server_url, options, null).on('error', function(err) {
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
        request(this.server_url, options, null).on('error', function(err) {
            console.log(`remote_server request failed: "${err}"`);
        });
    }
}
