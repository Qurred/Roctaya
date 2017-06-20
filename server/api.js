const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const pg = require('pg');
const pgConnectionString = process.env.DATABASE_URL || require('../config.json').pg.URI;
const secret = process.env.SECRET;
const hashSecret = process.env.HASHSECRET; //Not the best way, rainbow atk is possible still
var client = null; 

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
            text:`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent fermentum varius convallis. Suspendisse ut risus sed felis gravida interdum eget in ipsum. Duis ultrices purus ac congue hendrerit. Praesent eros turpis, dignissim vel fringilla a, auctor at lorem. Sed ac quam nec ante rhoncus posuere volutpat sit amet mi. Praesent at ligula lacus. Sed fermentum sed arcu non commodo.

Donec aliquet imperdiet eros, quis tristique arcu pulvinar id. Suspendisse scelerisque sagittis porttitor. Aliquam et leo at ex ornare malesuada ut vel nunc. In dolor elit, commodo quis lacus at, mattis euismod sem. Nulla malesuada augue a tellus viverra, nec pharetra sem tincidunt. Curabitur quis maximus libero, a elementum velit. Vestibulum et ex ante. Sed id libero sit amet justo ultrices luctus eu at diam. Duis nec rhoncus odio. Curabitur egestas orci diam. Duis aliquam ligula blandit porttitor pharetra. Curabitur vitae suscipit sapien. Morbi et ipsum consectetur, sodales ante ac, egestas risus. Donec malesuada luctus ligula, eu vehicula dui.

Nullam vestibulum lacus eget posuere feugiat. Vestibulum tincidunt neque vitae ullamcorper varius. Proin hendrerit lectus mi, sodales bibendum velit sagittis ac. Morbi eget purus eget mauris convallis fringilla sit amet nec libero. Integer consequat ullamcorper turpis, vel venenatis leo. Mauris luctus mi vel erat consectetur convallis. Nulla venenatis ultrices metus, ut convallis felis placerat eu. Fusce semper diam nibh, eget vulputate justo euismod ac.`
        });
    }
    return res.status(200).send(news);
});

router.post('/signup',(req,res,next) =>{
    if(req.body.query){
        var query = Buffer.from(req.body.query, `base64`).toString('ascii').split(":");
        if(query.length != 3){
            return res.status(401).json({
                message:'Invalid signup parameters',
                status: false
            });
        }
        console.log(query);
        var hashed = crypto.createHmac('sha256', hashSecret).update(query[2]).digest('hex');
        console.log(hashed);
        pg.connect(pgConnectionString, (err, client, done) => {
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({message: `Internal error`});
            }
            client.query('INSERT INTO player(username, nickname, password) values($1,$2,$3)',[query[0],query[1],hashed]);
            done(); //Closes the connection
            return res.status(200).json({
                message: `Signup success`,
                status: true
            });
         });
    }else{
        return res.status(401).json({
            message:'Invalid signup parameters',
            status: false
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
        const hashed = crypto.createHmac('sha256', hashSecret).update(query[1]).digest('hex');
        var  result = {message:'Failed to signin'};
        pg.connect(pgConnectionString, (err, client, done) => {
            if(err) {
                done();
                console.log(`Signin`,err);
                return res.status(500).json({message: `Internal error`});
            }
            const q = client.query("SELECT * FROM player where UPPER(username) = UPPER($1)", [query[0]]);            
            q.on('row', (row) =>{
                //TODO make better
                if(row.password === hashed){
                    result.message = `Signin success`;
                    result.id = row.id;
                    result.nickname = row.nickname;
                    result.token = jwt.sign({
                        id: row.id,
                        nickname:row.nickname
                    },secret,{expiresIn: 3600});
                }
            });
            q.on('end', () =>{
                done();
                return res.status(result.id? 200: 401).json(result);
            });
        });
    }else{
        return res.status(401).json({
            message:'Invalid signin parameters',
            status: false
        });
    }
});


//Now the middleware to verify token
router.use(function(req,res,next){
    //GET is using req.headers
    //POST is using body, maybe we should put post to headers also?
    var token = req.body.token || req.headers['x-access-token']; //or should we use other name for header?
    if(token){
        jwt.verify(token,secret, function(err, result){
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