const jwt = require('jsonwebtoken');

module.exports = function (req, res, next, secret) {
    //GET is using req.headers
    //POST is using body, maybe we should put post to headers also?
    var token = req.body.token || req.headers['token']; //or should we use other name for header?
    console.log(secret);
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
}