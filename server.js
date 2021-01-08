const fs = require('fs/promises');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')
const check_incident = require('./check-incident');

const port = 3000;
const app = express();

app.set('json spaces', 2);
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/api/manifest', (req, res) => {
    res.sendFile(path.join(__dirname + '/manifest.json'));
});

app.post('/api/check', (req, res) => {
    check_incident.checkService(req.body)
        .then(result => res.send(result));
});

app.get('/api/check-alll', (req, res) => {
    fs.readFile('manifest.json', 'utf8').then(body => {
        const manifest = JSON.parse(body);
        const checks = [];

        const promises = manifest.map(service =>
            check_incident.checkService(service).then(result => {
                checks.push(result);
            })
        );

        Promise.all(promises).then(() => {
            res.send(checks);
        });
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});