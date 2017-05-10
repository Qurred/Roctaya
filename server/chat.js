var io;

// example user for chat
// id: int
// nickname: string
// _socket: io socket

module.exports = function (http,members){
    io = require('socket.io')(http);
    console.log('Chat', 'Server ready');

    //handles data traffic via socket-io
    io.on('connection', (socket) =>{
        console.log('New user!');
        socket.emit('welc','Hello');


    });


}