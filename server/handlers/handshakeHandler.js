
module.exports = function(socket, users){
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
}