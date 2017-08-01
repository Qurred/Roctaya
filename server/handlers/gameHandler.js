const crypto = require("crypto");
const battle = require('../game/battle');
const currentGames = {};

module.exports = function(client, users, user){

    client.on('newGame', (data) =>{
        if(user.game_id && user.game_id !== ''){
            client.emit('newGame',{
                status: 'failed'
            })
            return;
        }

        if(data.type === 0){
            // Create new AI game
        }else if(data.type === 1){
            //Send challenge to challenged player
            const id = data.challenged;
            for(let i = 0; i < users.length; i++){
                if(id === users[i].id){
                    const game_id = crypto.randomBytes(12).toString('hex');
                    user.game_id = game_id;
                    currentGames[game_id] = {
                        playerA: user
                    }
                    //Send challenge noti
                    users[i].socket.emit('newGame', {
                        c_nick: user.nickname,
                        c_id: user.id,
                        game_id: game_id
                    });
                    break;
                }
            }
        }
    });

    client.on('cha', (data) =>{
        const game = currentGames[data.game_id];
        if(!game){ console.log('wut...',data.game_id); }
        if(data.response === 1){
            game.playerB = user;
            console.log(game);
            game.battle = new battle();
            game.playerA.socket.emit('wfc',{});
            game.playerB.socket.emit('wfc',{});
        }else{
            game.playerA.game_id = '';
            game.playerA.socket.emit('noGame',{});
        }
    });

    
    client.on('characters', (data)=>{
        const game = currentGames[data.game_id];
        if(!game){
            console.log('Error, no game', data);
            return;
        }
        game.battle.createTeam(data.player_id, data.characters);
    });
}