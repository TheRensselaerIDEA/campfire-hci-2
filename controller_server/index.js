/**
 * index.js
 * 
 * Entry point for controller server
 * 
 * Author: Antonio Fiol-Mahon
 */

const express = require('express');
const launcher_client = require('./launcher_client.js');

const app = express();
const PORT = 3000;

const launcherClient = new launcher_client({'ip': '0.0.0.0', 'port': '2000'});
const app_list = launcherClient.get_app_list();

// Configure express preferences
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/controller/:app_id', (req, res) => {
    let app_id = req.params['app_id'];
    let open_app = app_list[app_id];
    let name = open_app['name'];
    let control_url = open_app['controllerURL'];
    res.render('controller', {title: 'Remote', name:name, displayurl: control_url});
});

app.get('/open/:app_id', (req, res) => {
    let app_id = req.params['app_id'];
    let view_code = launcherClient.open_app(app_id);
    if (view_code == -1) {
        res.redirect('/launcher');
    } else {
        res.redirect(`/controller/${view_code}`);
    }
    console.log("no return!");
});

app.get('/launcher', (req, res) => {
    res.render('launcher', {title: 'Launcher', appList: app_list});
});

app.get('/', (req, res) => {
    res.redirect('/launcher');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
