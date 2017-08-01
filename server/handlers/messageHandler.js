
module.exports = function (client, users, user) {
  // Basic message to everyone
  client.on('message', (message) => {
    if (validateMessage(message)) {
      client.broadcast.emit('message', {
        sender: user.nickname,
        senderId: user.id,
        msg: filterBadWords(message)
      });
    }
  });

  // Private message to other user
  client.on('pm', (data) => {
    if (validateMessage(data.message)) {
      const receiver = data.id;
      for (let i = 0; i < users.length; i++) {
        if (users[i].id === receiver) {
          users[i].socket.emit('pm', {
            sender: user.nickname,
            senderId: user.id,
            msg: filterBadWords(data.message)
          });
          break;
        }// IF
      }// FOR
    }// IF
  });

}

filterBadWords = function (msg) {
  const listOfWords = [ //Should be external file...
    'fool',
    'dumb',
    'test'
  ];
  const rgx = new RegExp(listOfWords.join("|"), "gi");
  return msg.message.replace(rgx, "****");
}

validateMessage = function (msg) {
  if (msg.message.trim() !== '') {
    return true;
  }
  return false;
}

