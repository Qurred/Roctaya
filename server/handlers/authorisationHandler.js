const jwt = require('jsonwebtoken');
const secret = require('../database').secret;
module.exports = function(socket, next){
    const handshake = socket.handshake.query.token;
    if (handshake) {
      jwt.verify(handshake, process.env.SECRET || secret, function (err, result) {
        if (err) {
          console.log('Denied')
          return next('Deny', false);
        } else {
          socket.user = {
            id: result.id,
            nickname: result.nickname
          }
          next(null, true);
        }
      });
    } else {
      console.log('Denied')
      return next('Deny', false);
    }
}