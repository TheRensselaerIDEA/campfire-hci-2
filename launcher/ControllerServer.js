/**
 * The webserver for the mobile launcher controller
 * 
 * Author: Antonio Fiol-Mahon
 */


 module.exports = function ControllerServer(port, app_list) {
    const ChildUtils = require('./ChildUtils.js');
    const express = require('express');
    
    this.webapp = express();
    this.port = port;
    this.app_list = app_list;

    // Configure express preferences
    this.webapp.set('views', './views');
    this.webapp.set('view engine', 'pug');
    this.webapp.use(express.static('public'));
    
    // Configure route behavior
    this.webapp.get('/controller/:app_id', (req, res) => {
        let app_id = req.params['app_id'];
        let open_app = app_list[app_id];
        let name = open_app['name'];
        let control_url = open_app['controllerURL'];
        res.render('controller', {title: 'Remote', name:name, displayurl: control_url});
    });
    
    this.webapp.get('/open/:app_id', (req, res) => {
        let app_id = req.params['app_id'];
        ChildUtils.openApp(app_id);
        res.redirect(`/controller/${app_id}`);
    });

    this.webapp.get('/close', (req, res) => {
        ChildUtils.closeApp();
        res.redirect('/launcher');
    });
    
    this.webapp.get('/launcher', (req, res) => {
        res.render('launcher', {title: 'Launcher', appList: app_list});
    });

    this.webapp.get('/', (req, res) => {
        res.redirect('/launcher');
    });

    // Publish the currently open view, -1 for launcher, 0-infinity for current open app index
    this.webapp.get('/status', (req, res) => {
        res.send(ChildUtils.openChild);
    });

    
    // Start the webserver
    this.webapp.listen(this.port, () => {
        console.log(`Controller Server running on port ${this.port}`);
    });
    
 }