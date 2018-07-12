const request = require('request');

const url = require('url');

var SERVER_URL = 'http://127.0.0.1:5000/';

module.exports = {
    /**
     * Send server request to open the specified URL
     * @param {string} target_url - URL to open in remote view controller
     */
    setURL: function (target_url) {
        let options = {
            method: 'GET',
            headers: {
                'User-Agent': 'request',
                'cmd': 'open',
                'url': target_url
            }
        };
        request(SERVER_URL, options, null);
    },

    /**
     * Close remote view controller display
     */
    closeVC: function() {
        let options = {
            method: 'GET',
            headers: {
                'User-Agent': 'request',
                'cmd': 'close',
            }
        };
        request(SERVER_URL, options, null);
    }
}
