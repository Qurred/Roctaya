const pool = require('../database').pool;
const character = require('./character');


createCharracter = function (playerId, characterId) {
    pool.connect((err, client, done) => {
        if (err) {
            done();
            return;
        }
        client.query('SELECT DISTINCT C.id, C.name, C.health, C.mana, C.defence, C.speed, C.attack, C.intellect, C.sanity, C.image, H.xp ' +
        'FROM character as C, has_character as H WHERE H.player_id = $1 and H.character_id = $2 and H.character_id = C.id;', [playerId, characterId],
         (err, result) => {
            if (err) {console.log(err); return;}
            const res = result.rows[0];
            let char = new character(res.id, res.name, res.health, res.mana, res.defence, res.speed, res.attack, res.intellect, res.sanity, res.xp);
            done();
            return char;
         });
    });
}

createActionOrder = function (a,b) {
    const constant = 1 / 148;
    x = a.skill.priority * (a.character.speed * constant);
    y = b.skill.priority * (b.character.speed * constant);
    return x - y;
}

exports.createCharracter = createCharracter;

exports.createActionOrder = createActionOrder;