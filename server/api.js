const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const pg = require('pg');
const url = require('url')
// const pgConnectionString = process.env.DATABASE_URL || require('../config.json').url;
const secret = process.env.SECRET || require('../config.json').secret;;
const hashSecret = process.env.HASHSECRET || require('../config.json').hash;; //Not the best way, rainbow atk is possible still
// var client = null;
const params = url.parse(process.env.DATABASE_URL || require('../config.json').url);
const auth = params.auth.split(':');

const poolConfig = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: true
}

const pool = new pg.Pool(poolConfig);

router.get('/news', (req, res, next) => {
  let result = {
    offset: req.query.offset ? req.query.offset : 0,
    news: []
  }
  pool.connect((err, client, done) => {
    if (err) {
      done();
      return res.status(500).json({ message: `Internal error` });
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

router.post('/signup', (req, res, next) => {
  if (req.body.query) {
    //username:nickname:email:password
    var query = Buffer.from(req.body.query, `base64`).toString('ascii').split(":");
    if (query.length != 4) {
      return res.status(401).json({
        message: 'Invalid signup parameters',
        status: false
      });
    }
    pool.connect((err, client, done) => {
      let valid = {};
      function signupCallback(err, result, value) {
        if (err) {
          console.log(err);
        }
        valid[value] = result.rows.length == 0 ? true : false;
        if (Object.keys(valid).length == 4){
          //Checks if there is false values
          if (!valid.username || !valid.nickname || !valid.email || !valid.password) {
            console.log('error', valid);
            done();
            return res.status(401).json(valid);
          }
          const hashed = crypto.createHmac('sha256', hashSecret).update(password).digest('hex');
          client.query('INSERT INTO player(username, nickname,email, password) values($1,$2,$3,$4)', [query[0], query[1],query[2], hashed]);
          done(); //Closes the connection
          return res.status(200).json(valid);
        }
      }

      if (err) {
        done();
        console.log(err);
        return res.status(500).json({ message: `Internal error` });
      }
      client.query('SELECT * FROM player WHERE UPPER(username) = UPPER($1)', [query[0]], (err, row) => signupCallback(err, row, "username"));
      client.query("SELECT * FROM player WHERE UPPER(nickname) = UPPER($1)", [query[1]], (err, row) => signupCallback(err, row, "nickname"));
      client.query("SELECT * FROM player where UPPER(email) = UPPER($1)", [query[2]], (err, row) => signupCallback(err, row, "email"));
      const password = query[3]
      if (password.length < 6) {//Currently only thing to check if minlength
        valid.password = false;
      }
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
    pool.connect((err, client, done) => {
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
  var token = req.body.token || req.headers['token']; //or should we use other name for header?
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
  console.log(req.decoded);
  const playerId = req.decoded.id;

  //Get datas from characters
  let characters = [];
  pool.connect((err, client, done) => {
   client.query('SELECT C.id, C.name, C.story, C.health, C.mana, C.defence, C.speed, C.attack, C.intellect, C.sanity, C.image, H.xp '+
                'FROM character as C, has_character as H '+
                'WHERE H.player_id = $1 and H.character_id = C.id;',
                 [playerId], (err,result) =>{
      if(err) console.log(err);
      if(result.rows.length == 0){
        client.query('INSERT INTO has_character (player_id, character_id)'+
         'values ($1,1), ($1,2), ($1,3), ($1,4), ($1,5), ($1,6), ($1,7), ($1,8);', [playerId]);
         done();
         //Create a way to get now characters
      }else{
        for(let i = 0; i < result.rows.length; i++){
        let character = result.rows[i];
          characters.push({
            id: character.id,
            name: character.name,
            story: character.story,
            img_path: character.image,
            health: character.health,
            mana: character.mana,
            defence: character.defence,
            speed: character.speed,
            attack: character.attack,
            intellect: character.intellect,
            sanity: character.sanity,
            xp: character.xp
          });
        }
        done();
        res.status(200).send(characters);
      }
    });
  })
});


router.get('/player', (req, res, next) => {
  const searchable = req.query.username;
  if (!searchable) {
    return res.status(401).json({ message: 'Player not provided' });
  }
  pool.connect((err, client, done) => {
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
