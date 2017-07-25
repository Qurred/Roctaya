const pool = require('../database').pool;

// TODO upgrate https://node-postgres.com/guides/upgrading

module.exports = function (req, res, next) {
    console.log('news!')
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
}