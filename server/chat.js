
// example user for chat
// id: int
// nickname: string
// _socket: io socket

//Maybe rename this js-file into 'game.js' ?

module.exports = function (http,users){

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
    console.log('Chat', 'Server ready');
    console.log('Chat', `Users online: ${users.length}`);

    /////////////////////////////////////////////////////////
    ////    DIVIDE THIS FILE INTO THE MULTIPLE FILES    /////
    ////      TRY TO SPLIT BY USAGE, AUTH, CHAT ETC     /////
    /////////////////////////////////////////////////////////

    //Authorisation
    io.use((socket, next)=>{
        const handshake = socket.handshake.query.token;
        if(handshake){
            jwt.verify(token,process.env.SECRET, function(err, result){
                if(err){
                    console.log('Chat','Error with handshake, denying connection',err); //Debug
                    return next('Deny', false);
                }else{
                    next(null, true);
                }
            });
        }else{
            console.log('Chat','Error with handshake, denying connection',handshake); //Debug
            return next('Deny', false);
        }
    });

    //handles data traffic via socket-io
    io.on('connection', (socket) =>{
        console.log('New user!', socket.handshake.query); //Debug
        //TODO FOR LOOP TO CHECK IF ALREADY ONLINE
        // AKA REMOVE DUBLICATES
        socket.emit('users','welcome, this message will became a list of online users');
        console.log('Chat', 'Currently ' + usersA + ' user online') //Debug

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