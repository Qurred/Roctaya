
// example user for chat
// id: int
// nickname: string
// _socket: io socket

//Maybe rename this js-file into 'game.js' ?

module.exports = function (http,users){
    var usersA = 0;
    var io = require('socket.io')(http);
    console.log('Chat', 'Server ready');
    console.log('Chat', 'Currently ' + usersA + ' user online')
    //handles data traffic via socket-io
    io.on('connection', (socket) =>{
        console.log('New user!', socket.handshake.query);
        socket.emit('welc','Hello, there is currently '+ usersA+ ' users online!');
        usersA++;
        console.log('Chat', 'Currently ' + usersA + ' user online')

        socket.on('msg',(message) =>{
            console.log('Socket Message', message);
            socket.broadcast.emit('msg',{
                sender: 'tmp name',
                msg: message
            });
        })

        socket.on('disconnect', () =>{
            usersA--;
            socket.broadcast.emit('msg',{
                sender: 'Server',
                msg: 'User Disconnected, Currently ' + usersA + ' user online'
            });
            console.log('Chat', 'User Disconnected, Currently ' + usersA + ' user online')
        });
    });

}