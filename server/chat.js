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

    /////////////////////////////////////////////////////////
    ////    DIVIDE THIS FILE INTO THE MULTIPLE FILES    /////
    ////      TRY TO SPLIT BY USAGE, AUTH, CHAT ETC     /////
    /////////////////////////////////////////////////////////

    //Authorisation
    io.use((socket, next)=>{
        const handshake = socket.handshake.query.token;
        if(handshake){
            jwt.verify(handshake,process.env.SECRET, function(err, result){
                if(err){
                    console.log('Chat','Error with handshake, denying connection',err); //Debug
                    return next('Deny', false);
                }else{
                    // let user = {
                    //     id: result.id,
                    //     nickname: result.nickname,
                    //     socket:socket
                    // } //Let's do this later...
                    // users.push(user);
                    console.log('Chat','Middleware');
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

        jwt.verify(socket.handshake.query.token,process.env.SECRET, function(err, result){
            if(err) return;
            user.id = result.id;
            user.nickname = result.nickname;
            user.socket = socket;
            console.log('Chat','Connection')
        });

        let user = {};

        //For loop to check if user is already online
        for(let i = 0; i < users.length; i++){
            if(users[i].id == user.id){
                users[i].socket.disconnect(true);
                users.splice(i,1);
                users.push(user);
                break;
            }
        }

        //Gets the list of online users
        let userList = [];
        for (var u in users) {
            userList.push({
                id:u.id,
                nickname:u.nickname
            });
        }

        socket.emit('users',{users:userList});
        console.log('Chat', 'Currently ' + usersA + ' user online') //Debug

        socket.on('message',(message) =>{
            console.log('Socket Message', message);
            socket.broadcast.emit('msg',{
                sender: user.nickname,
                msg: message
            });
        });

        socket.on('disconnect', () =>{
            //Look for user and remove it
            socket.broadcast.emit('msg',{
                sender: 'Server',
                msg: 'User Disconnected, Currently ' + usersA + ' user online'
            });
            console.log('Chat', 'User Disconnected, Currently ' + usersA + ' user online')
        });
    });

}