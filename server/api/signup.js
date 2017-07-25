const pool = require('../database').pool;
const crypto = require('crypto');

let valid = {}
let _done, _res;

// function that checks if user is ok to signup
// Format for info is: username:nickname:email:password
module.exports = function (req, res, next) {
    if (req.body.query) { // Checks if there is query
        var query = Buffer.from(req.body.query, `base64`).toString('ascii').split(":");
        if (query.length != 4) {
            return res.status(401).json({
                message: 'Invalid signup parameters',
                status: false
            });
        }
        pool.connect((err, client, done) => {
            valid = {};
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({ message: `Internal error` });
            }
            _done = done;
            _res = res;
            // ASYNC Check for given parameters
            client.query('SELECT * FROM player WHERE UPPER(username) = UPPER($1)', [query[0]], (err, row) => signupCallback(err, row, "username"));
            client.query("SELECT * FROM player WHERE UPPER(nickname) = UPPER($1)", [query[1]], (err, row) => signupCallback(err, row, "nickname"));
            client.query("SELECT * FROM player where UPPER(email) = UPPER($1)", [query[2]], (err, row) => signupCallback(err, row, "email"));
            checkPassword(query[3]);
        });
    } else { // There wasn't query so sending this info to client
        return res.status(401).json({
            message: 'Invalid signup parameters',
            status: false
        }); // Return
    } // ELSE
}// module.exports

function checkPassword(password) {
    if (password.length < 6) {// Currently only thing to check if minlength
        valid.password = false;
    }
}

function signupCallback(err, result, value) {
    if (err) {
        console.log(err);
    }
    // If there is no matches it means that it is free to use
    valid[value] = result.rows.length == 0 ? true : false;
    // If valid has 4 objects (all checked)
    if (Object.keys(valid).length == 4) {
        // Checks if there is false values
        if (!valid.username || !valid.nickname || !valid.email || !valid.password) {
            _done(); // Closes the connection
            return _res.status(401).json(valid);
        } // IF
        const hashed = crypto.createHmac('sha256', hashSecret).update(password).digest('hex');
        client.query('INSERT INTO player(username, nickname,email, password) values($1,$2,$3,$4)', [query[0], query[1], query[2], hashed]);
        _done(); // Closes the connection
        return _res.status(200).json(valid);
    } // IF 
}// signupCallback