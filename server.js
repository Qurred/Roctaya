const express = require('express'),
    path = require('path'),
    http = require('http')
    bodyParser = require('body-parser');

//Link to api
const api = require('./server/api');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//makes dist-folder static, folder where ng2 will be for now
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public')));


//TODO
//Figure out a way to force https
//AKA redirect to https://roctaya.herokuapp.com if using http


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('access-Control-Allow-Origin', '*');
    console.log(req.method);
    if (req.method === "OPTIONS"){ //TODO remove if-else later
        res.send(200); //For development
    }else{ 
        next();
    }
});

app.use('/api', api);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'dist/index.html'));
});

app.set('port', process.env.PORT || '3000');

const server = http.createServer(app);

var users = [];

var chat = require('./server/chat')(server,users);

app.use(function(req, res, next) {
  res.redirect('/');
});

server.listen(app.get('port'), () => console.log(`Backend is running at ${app.get('port')}`));
