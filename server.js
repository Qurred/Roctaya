const express = require('express'),
    path = require('path'),
    http = require('http')
    bodyParser = require('body-parser');

//Link to api
//const api = require('path-to-api');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//makes dist-folder static, folder where ng2 will be for now
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'dist/index.html'));
});

app.set('port', process.env.PORT || '3000');

const server = http.createServer(app);

server.listen(process.env.PORT || '3000', () => console.log(`Backend is running`));
//TODO fix this *****
// var pg = require('pg');//.native;

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