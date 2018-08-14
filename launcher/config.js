/**
 * Global configuration, provides defaults if a local settings file cannot be found
 * 
 * Author: Antonio Fiol-Mahon
 */

// Imports
const path = require('path');

// Constants
const FLOOR_URL = path.join('file://', __dirname, 'docs', 'floor.html');
const WALL_URL = path.join('file://', __dirname, 'docs', 'wall.html');
const DEFAULT_REMOTE_IP = "127.0.0.1"
const DEFAULT_REMOTE_PORT = 5000;
const DEFAULT_CONTROLLER_PORT = 4000;
const DEFAULT_QUIT_ACCELERATOR = 'CommandOrControl+K';

module.exports = {

    getSettings: function () {
        // Try to load local file before using defaults
        try {
            var settings = require('./settings.json');
        } catch(err) {
            var settings = {};
        }
        // Configure settings object
        if (settings['hci'] == undefined) { settings['hci'] = {}; }
        if (settings['remote_ip'] == undefined) { settings['remote_ip'] = DEFAULT_REMOTE_IP; }
        if (settings['remote_port'] == undefined) { settings['remote_port'] = DEFAULT_REMOTE_PORT; }
        if (settings['controller_port'] == undefined) { settings['controller_port'] = DEFAULT_CONTROLLER_PORT; }
        if (settings['quit_accelerator'] == undefined) { settings['quit_accelerator'] = DEFAULT_QUIT_ACCELERATOR; }
        settings.hci['floorURL'] = FLOOR_URL;
        settings.hci['wallURL'] = WALL_URL;
        return settings;
    }
}