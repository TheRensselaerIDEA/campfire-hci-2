const request = require('request');

const url = require('url');

var SERVER_URL = 'http://128.113.130.179:5000/';

module.exports = {

    /**
     * Send server request to open the specified URL
     * @param {string} target_url - URL to open in remote view controller
     */
    openURL: function (target_url) {
        console.log(`RemoteClient: Opening Remote Page ${target_url}`);
        let options = {
            method: 'GET',
            headers: {
                'User-Agent': 'request',
                'cmd': 'open',
                'url': target_url
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
