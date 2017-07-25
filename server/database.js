const pg = require('pg');
const url = require('url')
const secret = process.env.SECRET || require('../config.json').secret;
const hashSecret = process.env.HASHSECRET || require('../config.json').hash; //Not the best way, rainbow atk is possible still
const params = url.parse(process.env.DATABASE_URL || require('../config.json').url);
const auth = params.auth.split(':');

// Just for debugging
console.log('database inited');

const poolConfig = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: true
}

const pool = new pg.Pool(poolConfig);

exports.secret = secret;

exports.pool = pool;