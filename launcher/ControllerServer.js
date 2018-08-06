/**
 * The webserver for the mobile launcher controller
 * 
 * Author: Antonio Fiol-Mahon
 */

const express = require('express');
const launcher_client = require('./launcher_client.js');

 module.exports = function ControllerServer(port, app_list) {
    
    this.webapp = express();
    this.port = port;
    this.app_list = app_list;

    // Configure express preferences
    this.webapp.set('views', './views');
    this.webapp.set('view engine', 'pug');
    this.webapp.use(express.static('public'));
    
    this.webapp.get('/controller/:app_id', (req, res) => {
        let app_id = req.params['app_id'];
        let open_app = app_list[app_id];
        let name = open_app['name'];
        let control_url = open_app['controllerURL'];
        res.render('controller', {title: 'Remote', name:name, displayurl: control_url});
    });
    
    this.webapp.get('/open/:app_id', (req, res) => {
        let app_id = req.params['app_id'];
        let view_code = launcherClient.open_app(app_id);
        if (view_code == -1) {
            res.redirect('/launcher');
        } else {
            res.redirect(`/controller/${view_code}`);
        }
        console.log("no return!");
    });
    
    this.webapp.get('/launcher', (req, res) => {
        res.render('launcher', {title: 'Launcher', appList: app_list});
    });
    
    this.webapp.get('/', (req, res) => {
        res.redirect('/launcher');
    });
    
    this.webapp.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
    
 }