
module.exports = function (server, users) {
  var users = [];
  var io = require('socket.io')(server);
  // Handlers
  const battleHandler = require('./handlers/gameHandler'),
    auth = require('./handlers/authorisationHandler'),
    handshake = require('./handlers/handshakeHandler'),
    messageHandler = require('./handlers/messageHandler');

  //Authorisation
  io.use((socket, next) => auth(socket, next));

  //handles data traffic via socket-io
  io.on('connection', (socket) => {

    var user = socket.user;
    socket.user = null;

    // Handlers
    handshake(socket, users);

    messageHandler(socket, users);

    battleHandler(socket);

    // Basic disconnect event, removes user from the list and tells every client about it
    socket.on('disconnect', () => {
      for (let i = 0; i < users.length; i++) {
        if (users[i].id == user.id) {
          users.splice(i, 1);
          break;
        }
      }
      socket.broadcast.emit('userDisconnect', {
        sender: 'Server',
        msg: user.nickname
      });
    });

  });// IO connection
}//Module
