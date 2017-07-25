const express = require('express'),
    path = require('path'),
    http = require('http'), 
    bodyParser = require('body-parser');

//Link to api
const api = require('./server/api');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//makes dist-folder static, folder where ng2 will be for now
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public')));

//Let's try and find a way to create somesort of bundle with webpack

//If using http redirecting to https
// app.use(function (req, res, next) {
//     console.log('Protocol',req.headers["x-forwarded-proto"] );
//     // x-forwarded-proto holds the information about used protocol which client uses to connect server
//     if (req.headers["x-forwarded-proto"] === "https") {
//         next();
//     } else {
//         res.redirect("https://" + req.headers.host + req.url);
//     }
// }); // Also seems like tgis aint working

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', ['Content-Type','token']); // Remove at least token when prod
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('access-Control-Allow-Origin', '*');
    if (req.method === "OPTIONS") { //TODO remove if-else later
        res.send(200); //For development
    } else {
        next();
    }
});

app.use('/api', api);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.set('port', process.env.PORT || '3000');

const server = http.createServer(app);

var users = [];

var chat = require('./server/socket')(server, users);

app.use(function (req, res, next) {
    res.redirect('/');
});

server.listen(app.get('port'), () => console.log(`Backend is running at ${app.get('port')}`));
