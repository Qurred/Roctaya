const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const pg = require('pg');
const pgConnectionString = process.env.DATABASE_URL || require('../config.json').url;
const secret = process.env.SECRET || require('../config.json').secret;;
const hashSecret = process.env.HASHSECRET || require('../config.json').hash;; //Not the best way, rainbow atk is possible still
var client = null;

// TODO Create pg pooling


router.get('/news', (req, res, next) => {
  let result = {
    offset: req.query.offset ? req.query.offset : 0,
    news: []
  }
  pg.connect(pgConnectionString, (err, client, done) => {
    if (err) {
      done();
      return res.status(500).json({message: `Internal error`});
    }
    const q = client.query("SELECT N.title, N.body, N.banner, N.time::timestamp::date, P.nickname  FROM news as N, player as P WHERE N.creator_id = P.id ORDER BY N.id DESC LIMIT 5 OFFSET $1;", [req.query.offset ? req.query.offset : 0]);
    q.on('row', (row) => {
      let news = {
        title: row.title,
        creator: row.nickname,
        banner: row.banner,
        time: row.time,
        body: row.body
      }
      result.news.push(news);
    });
    q.on('end', () => {
      done();
      return res.status(200).send(result);
    });
  });
});

//Signup functions...
function checkUsername(name){

}
function checkNickname(name){
  
}
function checkEmail(email){
  
}
function checkPassword(password){
  
}

//Currently sending result before querys are done

router.post('/signup', (req, res, next) => {
  if (req.body.query) {
    //username:nickname:email:password
    var query = Buffer.from(req.body.query, `base64`).toString('ascii').split(":");
    if (query.length != 3) { //TODO change it to 4 when database has email field
      return res.status(401).json({
        message: 'Invalid signup parameters',
        status: false
      });
    }
    
    pg.connect(pgConnectionString, (err, client, done) => {
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({message: `Internal error`});
      }

      let result = {
        username: true,
        nickname: true,
        email: true,
        password: true
      };

      //Let's start by checking values
      //Username
      console.log("username query");
      let q = client.query('SELECT * FROM player WHERE UPPER(username) = UPPER($1)', [query[0]]);
      q.on('row', (row)=>{
        console.log("username found");
        result.username = false;
      })
      // q.on('end', ()=>{
      //   console.log('moi');
      // })
      //nickname
      q = client.query("SELECT * FROM player WHERE UPPER(nickname) = UPPER($1)", [query[1]]);
      q.on('row', (row)=>{
        result.nickname = false;
      })

      //Email //TODO uncomment when database has email
      // q = client.query("SELECT * FROM player where UPPER(email) = UPPER($1)", [query[3]]);
      // q.on('row', (row)=>{
      //   result.email = false;
      // })

      //Password
      const password = query[2] //TODO change to 3 when email is added
      if(password.length < 6){
        result.password = false;
      }

      if(!result.username || !result.nickname || !result.email || !result.password){
        console.log('"sending"');
        done();
        return res.status(401).json({result});
      }
      console.log('adding');
      const hashed = crypto.createHmac('sha256', hashSecret).update(password).digest('hex'); //Hashes the password
      client.query('INSERT INTO player(username, nickname, password) values($1,$2,$3)', [query[0], query[1], hashed]);
      done(); //Closes the connection
      return res.status(200).json(result);
    });
  } else {
    return res.status(401).json({
      message: 'Invalid signup parameters',
      status: false
    });
  }
})




router.post('/signin', (req, res, next) => {
  if (req.body.query) {
    const query = Buffer.from(req.body.query, `base64`).toString('ascii').split(":");
    if (query.length != 2) {
      return res.status(401).json({ //Change code 
        status: 'Invalid signin parameters'
      });
    }
    const hashed = crypto.createHmac('sha256', hashSecret).update(query[1]).digest('hex');
    var result = {
      message: 'Failed to signin'
    };
    pg.connect(pgConnectionString, (err, client, done) => {
      if (err) {
        done();
        console.log(`Signin`, err);
        return res.status(500).json({
          message: `Internal error`
        });
      }
      const q = client.query("SELECT * FROM player where UPPER(username) = UPPER($1)", [query[0]]);
      q.on('row', (row) => {
        //TODO make better
        if (row.password === hashed) {
          result.message = `Signin success`;
          result.id = row.id;
          result.nickname = row.nickname;
          result.token = jwt.sign({
            id: row.id,
            nickname: row.nickname
          }, secret, {
              expiresIn: 3600
            });
        }
      });
      q.on('end', () => {
        done();
        return res.status(result.id ? 200 : 401).json(result);
      });
    });
  } else {
    return res.status(401).json({
      message: 'No signin parameters provided',
      status: false
    });
  }
});

router.get('/verify', (req, res, next) => {
  const token = req.query.token;
  if (!token) { return res.status(401).json({ message: 'No token provided', valid: false }); }
  jwt.verify(token, secret, function (err, result) {
    if (err) { return res.status(401).json({ valid: false }); }
    return res.status(200).json({ valid: true });
  })
});


//Now the middleware to verify token
router.use(function (req, res, next) {
  //GET is using req.headers
  //POST is using body, maybe we should put post to headers also?
  var token = req.body.token || req.headers['x-access-token']; //or should we use other name for header?
  if (token) {
    jwt.verify(token, secret, function (err, result) {
      if (err) {
        return res.status(401).send({
          message: `Authenticating token failed`
        });
      } else {
        req.decoded = result;
        next();
      }
    });
  } else { //There is no token provided
    return res.status(403).send({
      message: 'No token found'
    });
  }
});

router.get('/characters', (req, res, next) => {
  //Get datas from characters
  var characters = [];
  //forloop
  //Add all characters
  //return characters
  for (var i = 0; i < 10; i++) {
    characters.push({
      id: i,
      name: "TEST CHARACTER",
      story: "Liiralaara",
      img_path: "placeholder.png"
    });
  }
  res.send({
    _characters: characters,
    status: 202
  });
});


router.get('/player', (req, res, next) => {
  const searchable = req.query.username;
  if (!searchable) {
    return res.status(401).json({ message: 'Player not provided' });
  }
  pg.connect(pgConnectionString, (err, client, done) => {
    if (err) {
      done();
      console.log(`Signin`, err);
      return res.status(500).json({
        message: `Internal error`
      });
    }
    const q = client.query("SELECT * FROM player where UPPER(username) = UPPER($1)", [searchable]);
    const result = {};
    q.on('row', (row) => {
      result.id = row.id;
      result.nickname = row.nickname;
    });
    q.on('end', () => {
      done();
      return res.status(result.id ? 200 : 401).json(result);
    });
  });
})

module.exports = router;
