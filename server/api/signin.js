const pool = require('../database').pool;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// TODO upgrate https://node-postgres.com/guides/upgrading

module.exports = function (req, res, next, secret, hashSecret) {
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
}