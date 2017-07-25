
module.exports = function (server, users) {
  var users = [];
  var io = require('socket.io')(server);
  const jwt = require('jsonwebtoken');
  const battleHandler = require('./game/gameHandler');
  const auth = require('./handlers/authorisationHandler');
  const handshake = require('./handlers/handshakeHandler');
  /////////////////////////////////////////////////////////
  ////    DIVIDE THIS FILE INTO THE MULTIPLE FILES    /////
  ////      TRY TO SPLIT BY USAGE, AUTH, CHAT ETC     /////
  /////////////////////////////////////////////////////////

  //Authorisation
  io.use((socket, next) => auth(socket, next));
  /*{ Remove after test
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
  });
  */

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //handles data traffic via socket-io
  io.on('connection', (socket) => {
    handshake(socket,users);
    /* remove after checking that this works
    var user = socket.user;
    socket.user = null;
    user.socket = socket;

    //For loop to check if user is already online
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === user.id) {
        users[i].socket.emit('disconnected', {
          sender: 'Server',
          msg: `Dublicate loggings, disconnecting original`
        });
        users[i].socket.disconnect(true);
        users.splice(i, 1);
        break;
      }
    }

    users.push(user);

    //Gets the list of online users
    var userList = [];
    console.log('Starting to loop users')
    console.log(users.length);
    for (let i = 0; i < users.length; i++) {
      console.log('Adding user:', users[i].id);
      userList.push({
        id: users[i].id,
        nickname: users[i].nickname
      });
    }
    socket.emit('users', {
      users: userList
    });

    socket.broadcast.emit('newUser', {
      id: user.id,
      nickname: user.nickname
    });
    */
    // End of connection

    //////////////////////////////////////////////////////////////////////////////////////////
    battleHandler(socket);
    // Basic message to everyone
    socket.on('message', (message) => {
      console.log('Socket Message', message);
      socket.broadcast.emit('message', {
        sender: user.nickname,
        senderId: user.id,
        msg: message
      });
    });

    // Private message to other user
    socket.on('pm', (data) => {
      const receiver = data.id;
      for (let i = 0; i < users.length; i++) {
        if (users[i].id === receiver) {
          users[i].socket.emit('pm', {
            sender: user.nickname,
            senderId: user.id,
            msg: data.message
          });
          break;
        }//if
      }//for
    });

    socket.on('ai-game', (data) => {
      //maybe we should split into files
    });

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
  });


}//Module
