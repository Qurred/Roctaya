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


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('access-Control-Allow-Origin', '*');
    if (req.method === "OPTIONS") //TODO remove if-else later
        res.send(200); //For development
    else 
        next();
    next();
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

//Fix it later
//var pg = require('pg');//.native;

// var config = require('./config.json');

// //var client = new pg.Client(config.pg);
// //console.log('PG',config.pg);
// pg.connect((process.env.DATABASE_URL || config.pg.URI),(err,client,done) =>{
//     if(err){
//         console.log(err);
//         return;
//     }
//     console.log('Connected');
// });