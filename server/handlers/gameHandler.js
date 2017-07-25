const battle = require('../game/battle');
const currentGames = [];

module.exports = function(client){

    client.on('searchGame', (data) =>{
        let type = data.type; // 0 AI; 1 Player
        let b = new battle(null,null);
        currentGames.push(b);
        console.log('this aint working :)');
    });

}