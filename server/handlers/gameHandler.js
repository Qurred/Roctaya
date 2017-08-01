const battle = require('../game/battle');
const currentGames = [];

module.exports = function(client, users, user){

    client.on('newGame', (data) =>{
        if(data.type === 0){
            // Create new AI game
        }else if(data.type === 1){
            //Send challenge to challenged player
            const id = data.challenged;
            for(let i = 0; i < users.length; i++){
                if(id === users[i].id){
                    //Send challenge noti
                    users[i].socket.emit('challenge', {
                        c_nick: user.nickname,
                        c_id: user.id,
                        game_id: 'xxxxxxxxxxxxxxxxxxxxx'
                    });
                }
            }
        }
        // let b = new battle(null,null);
        // currentGames.push(b);
        // console.log('this aint working :)');
    });

}