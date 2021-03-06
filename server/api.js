const express = require('express');
const router = express.Router();
const pool = require('./database');
// API functios, maybe later nest them into the one file
const signup = require('./api/signup')
const signin = require('./api/signin');
const news = require('./api/news');
const verify = require('./api/verify');
const middleware = require('./api/middleware');
const characters = require('./api/characters');
const player = require('./api/player');
// End of requires for router

// Public routes
router.get('/news', (req, res, next) => news(req,res,next));
router.post('/signup', (req, res, next) => signup(req, res, next));
router.post('/signin', (req, res, next) => signin(req, res, next, pool.secret,pool.hashSecret));
router.get('/verify', (req, res, next) => verify(req, res, next, pool.secret));

// Now the middleware to verify token
router.use((req, res, next) => middleware(req, res, next, pool.secret));

// Behind middleware
router.get('/characters', (req, res, next) => characters(req, res, next));
router.get('/player', (req, res, next) => player(req, res, next));

//Just testing
//  const battle = require('./game/battle');
//  new battle(1,1);
const util = require('./game/util');
let chars = []
for(let i = 2; i < 6; i++){
    chars.push(util.createCharracter(3,i));
}

module.exports = router;
