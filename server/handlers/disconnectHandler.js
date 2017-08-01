module.exports = function(client, users, user){
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
}