const pool = require('../database').pool;

// TODO upgrate https://node-postgres.com/guides/upgrading

module.exports = function (req, res, next) {
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
}