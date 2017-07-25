const jwt = require('jsonwebtoken');
module.exports = function(socket, next){
    const handshake = socket.handshake.query.token;
    if (handshake) {
      jwt.verify(handshake, process.env.SECRET, function (err, result) {
        if (err) {
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
      return next('Deny', false);
    }
}