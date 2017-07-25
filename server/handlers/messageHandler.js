
module.exports = function(client, users,user){
    // Basic message to everyone
    client.on('message', (message) => {
      if(validateMessage(message)){
        client.broadcast.emit('message', {
          sender: user.nickname,
          senderId: user.id,
          msg: filterBadWords(message)
        });
      }
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

filterBadWords = function(msg){
  const listOfWords = [ //Should be external file...
    'fool',
    'dumb',
    'test'
  ];
  const rgx = new RegExp(listOfWords.join("|"),"gi");
  return msg.replace(rgx, "****");
}

validateMessage = function(msg){
  if(msg.trim() !== ''){
    return true;
  }
  console.log('msg was empty', msg);
  return false;
}

