const battleHandler = require('./handlers/gameHandler'),
    auth = require('./handlers/authorisationHandler'),
    handshake = require('./handlers/handshakeHandler'),
    messageHandler = require('./handlers/messageHandler'),
    disconnectHandler = require('./handlers/disconnectHandler');
    
let users = [];


module.exports = function (server) {
  const io = require('socket.io')(server);
  //Authorisation
  io.use((socket, next) => auth(socket, next));
  //handles data traffic via socket-io
  io.on('connection', (socket) => {

    let user = socket.user;
    socket.user = null;

    // Handlers
    handshake(socket, users, user);

    messageHandler(socket, users, user);
    battleHandler(socket, users, user);
    disconnectHandler(socket, users, user);

  });// IO connection
}//Module
