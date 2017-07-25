const jwt = require('jsonwebtoken');
// TODO upgrate https://node-postgres.com/guides/upgrading

module.exports = function (req, res, next, secret) {
    const token = req.query.token;
    if (!token) { return res.status(401).json({ message: 'No token provided', valid: false }); }
    jwt.verify(token, secret, function (err, result) {
        if (err) { return res.status(401).json({ valid: false }); }
        return res.status(200).json({ valid: true });
    })
}