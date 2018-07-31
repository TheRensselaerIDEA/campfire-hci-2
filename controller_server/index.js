/**
 * index.js
 * 
 * Entry point for controller server
 * 
 * Author: Antonio Fiol-Mahon
 */

const express = require('express');

const app = express();
const PORT = 3000;

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/controller', (req, res) => {
    res.render('controller', {title: 'Remote', displayurl: 'https://lp01.idea.rpi.edu/shiny/mankoa/TwitterBrowserMW/?Controller'});
});

app.get('/launcher', (req, res) => {
    res.render('launcher', {title: 'Launcher'});
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});