module.exports = function (http, users) {

  /*USER MODEL FOR NOW
  {
      id:id,
      nick: nickname,
      _socket:socket
  }
  */

  var users = [];
  var io = require('socket.io')(http);
  const jwt = require('jsonwebtoken');

  /////////////////////////////////////////////////////////
  ////    DIVIDE THIS FILE INTO THE MULTIPLE FILES    /////
  ////      TRY TO SPLIT BY USAGE, AUTH, CHAT ETC     /////
  /////////////////////////////////////////////////////////

  //Authorisation
  io.use((socket, next) => {
    const handshake = socket.handshake.query.token;
    if (handshake) {
      jwt.verify(handshake, process.env.SECRET, function (err, result) {
        if (err) {
          return next('Deny', false);
        } else {
          next(null, true);
        }
      });
    } else {
      return next('Deny', false);
    }
  });

  //handles data traffic via socket-io
  io.on('connection', (socket) => {
    var user = {};
    jwt.verify(socket.handshake.query.token, process.env.SECRET, function (err, result) {
      if (err) return;
      console.log(result);
      user.id = result.id;
      user.nickname = result.nickname;
      user.socket = socket;
      console.log('Chat', 'Connection')
    });


    //For loop to check if user is already online
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === user.id) {
        console.log('Chat', 'Removing old instance');
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
    console.log('Added user: ', user);
    //Gets the list of online users
    var userList = [];
    console.log('Starting to loop users')
    for (var u in users) {
      console.log('Adding user:',u);
      userList.push({
        id: u.id,
        nickname: u.nickname
      });
    }

    socket.emit('users', {
      users: userList
    });

    socket.on('message', (message) => {
      console.log('Socket Message', message);
      socket.broadcast.emit('message', {
        sender: user.nickname,
        msg: message
      });
    });

    socket.on('disconnect', () => {
      for(let i = 0; i < users.length; i++){
        if(users[i].id == user.id){
          users.splice(i,1);
          break;
        }
      }
      socket.broadcast.emit('userDisconnect', {
        sender: 'Server',
        msg: `User ${user.nickname} Disconnected`
      });
    });
  });

}
