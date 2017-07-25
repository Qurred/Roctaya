
module.exports = function(client, users){
    // Basic message to everyone
    client.on('message', (message) => {
      console.log('Socket Message', message);
      client.broadcast.emit('message', {
        sender: user.nickname,
        senderId: user.id,
        msg: message
      });
    });

    // Private message to other user
    client.on('pm', (data) => {
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
}