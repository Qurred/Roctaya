const pool = require('../database').pool;

// TODO upgrate https://node-postgres.com/guides/upgrading

module.exports = function (req, res, next) {
    const playerId = req.decoded.id;
    //Get datas from characters
    let characters = [];
    pool.connect((err, client, done) => {
        client.query('SELECT C.id, C.name, C.story, C.health, C.mana, C.defence, C.speed, C.attack, C.intellect, C.sanity, C.image, H.xp ' +
            'FROM character as C, has_character as H WHERE H.player_id = $1 and H.character_id = C.id;', [playerId], (err, result) => {
                if (err) console.log(err);
                if (result.rows.length == 0) {
                    client.query('INSERT INTO has_character (player_id, character_id)' +
                        'values ($1,1), ($1,2), ($1,3), ($1,4), ($1,5), ($1,6), ($1,7), ($1,8);', [playerId]);
                    done();
                    //Create a way to get now characters
                } else {
                    for (let i = 0; i < result.rows.length; i++) {
                        let character = result.rows[i];
                        characters.push({
                            id: character.id,
                            name: character.name,
                            story: character.story,
                            img_path: character.image,
                            health: character.health,
                            mana: character.mana,
                            defence: character.defence,
                            speed: character.speed,
                            attack: character.attack,
                            intellect: character.intellect,
                            sanity: character.sanity,
                            xp: character.xp
                        });
                    }
                    done();
                    res.status(200).send(characters);
                }
            });
    })
}