const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const pg = require('pg');
const pgConnectionString = process.env.DATABASE_URL || require('../config.json').pg.URI;
var client = null; 

function connectoToDB(){
    client = new pg.Client(pgConnectionString);
    client.connect((err,client,done) =>{
        if(err){
            return false;
        }return true;
    });
}

router.get('/news',(req,res,next) =>{
    //Gets all news from database
    var news = [];
    /**
     * format:{
     *  date:'',
     *  title:'',
     *  text:''
     * }
     * 
     * Should we add more? like offset or a link to next ones?
     * Should we limit the given result to... 5 or something?
     */

    for(var i = 0; i < 10; i++){
        news.push({
            date: 'testdate',
            title: `Test Title: ${i}`,
            text:`jkahrdgilukhfgkjlfghjlkfgdjlkdfghljkdfghjlk`
        });
    }
    return res.status(200).send(news);
});

router.post('/signup',(req,res,next) =>{
    if(req.body.query){
        var query = Buffer.from(req.body.query, `base64`).toString('ascii').split(":");
        if(query.length != 3){
            return res.status(401).json({ //Change code 
                status: 'Invalid signup parameters'
            });
        }
        //TODO CHANGE SECRET AND MOVE IT TO THE FILE
        var hashed = crypto.createHmac('sha256', 'superOpSecret').update(query[1]).digest('hex');
        if(!connectoToDB()) return res.status(500).json({message:`Internal failure`})
        client.query('INSERT INTO player(username, nickname, password) values($1,$2,$3)',[query[0],query[1],hashed]);
        //TMP return type to check if working
        client.end(err =>{
            if(err) console.log(err);
        });
        return res.status(200).json({
            status: `All is working, result is ${query[0]}:${hashed}`,
            data: `No database connection yet, so nothing is saved`
        });
    }else{
        return res.status(401).json({ //Change code 
            status: 'Invalid signup parameters'
        });
    }
    //Should we send token here or force them to login?
})

router.post('/signin', (req, res, next) =>{
    if(req.body.query){ 
        const query = Buffer.from(req.body.query, `base64`).toString('ascii').split(":");
        if(query.length != 2){
                return res.status(401).json({ //Change code 
                status: 'Invalid signin parameters'
            });
        }
        const hashed = crypto.createHmac('sha256', 'superOpSecret').update(query[1]).digest('hex');
        if(!connectoToDB()) return res.status(500).json({message:`Internal failure`})
        const q = client.query('SELECT * FROM player where username =($1)', [query[0]]);
        var  result = {};
        q.on('row', (row) =>{
            //TODO make better
            if(row.password == hashed){
                result.id = row.id;
                result.nickname = row.nickname;
                result.token = jwt.sign({
                    username:row.username
                }`secret`,  //From a file?
                {
                    expiresIn: 3600 //One hour, do we need more?
                });
            }else{
                result.message = 'Failed to signin'
            }
        });
        q.on('end', () =>{
            client.end();
            return res.status(result.id? 200: 401).json(result);
        });

    }else{
        return res.status(401).json({ //Change code 
            status: 'Invalid signin parameters'
        });
    }
    // if(req.body.user && req.body.pword){
    //     //TODO DATABASE CHECK
    //     //Should we send user it's id?
    //     //To use friendlist and other features we need to know id of an user.
    //     //But should we create an "fake id" which is linked into real id ?
    //     var tmp = {
    //     user: req.body.user,
    //     pword: req.body.pword,
    //     status: "ok",
    //     message: "Provided all needed data for this test",
    //     socket: "URL to the socket"
    //   };
    //   var token = jwt.sign({
    //       user: tmp.user
    //     }, //Payload, the data we want to save
    //     `secret`,  //From a file?
    //     {
    //         expiresIn: 3600 //One hour, do we need more?
    //     }
    //   )
    //   tmp.token = token;
    // }else{
    //     var tmp = {
    //         user: "",
    //         pword: "",
    //         status: "FALSE",
    //         message:"Didnt provide all needed info"
    //     }
    // }
    // console.log(tmp);
    // res.send(tmp);
    /*result with given parameters
        {
            "user": "kuha",
            "pword": "lahna",
            "status": "ok",
            "message": "Provided all needed data for this test",
            "socket": "URL to the socket",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoia3VoYSIsImlhdCI6MTQ5NzYxODU3NCwiZXhwIjoxNDk3NjIyMTc0fQ.WSlGLihE1TcyCTlpPGAvg8TJRLXmhglnSSVqLWwQmC0"
        }
    */
});


//Now the middleware to verify token
router.use(function(req,res,next){

    //GET is using req.headers
    //POST is using body, maybe we should put post to headers also?
    var token = req.body.token || req.headers['x-access-token']; //or should we use other name for header?
    if(token){
        jwt.verify(token,`secret`, function(err, result){
            if(err){
                return res.status(401).send({
                    message: `Authenticating token failed`
                });
            }else{
                req.decoded = result;
                next();
            }
        });

    }else{//There is no token provided
        return res.status(403).send({
            message: 'No token found'
        });
    }
});


router.get('/characters',(req, res, next) =>{
    //Get datas from characters
    var characters = [];
    //forloop
    //Add all characters
    //return characters
    for(var i = 0; i < 10; i++){
        characters.push({
            id: i,
            name: "TEST CHARACTER",
            story: "Liiralaara",
            img_path: "placeholder.png"
        });
    }
    res.send({
        _characters:characters,
        status: 202
    });
});

module.exports = router;