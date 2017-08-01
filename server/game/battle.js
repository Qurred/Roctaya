const util = require('./util');
const team = require('./team');

class Battle{
    constructor(teamA, teamB){
        this.teamA;
        this.teamB;
        this.events = [];
        this.turn = [];
    }

    createTeam(player_id, characters){
        let chars = [];
        for(let i = 0; i < characters.length; i++){
            chars.push(util.createCharracter(player_id,characters[i]));
        }
        if(!this.teamA){
            this.teamA = new team(player_id,chars);
        }else{
            this.teamB = new team(player_id,chars);
            startGame();
        }
    }

    startGame(){
        console.log('Both teams ready');
    }

    addTurnEvents(data){
        const playerId = data.id;
        let team;
        if(playerId === this.teamA.playerId){
            team = this.teamA;
        }else if(playerId === this.teamB.playerId){
            team = this.teamB;
        }else{
            console.log('Unknown player id');
            return;
        }
        data.events.forEach( event => {
            console.log(event);
            let c;
            // Looks for given character in team
            for (let i = 0; i < team.characters.length; i++) {
                if(event.characterId === team.characters[i].id){
                    c = team.characters[i];
                    break;
                }
            }

            // tmp add
            const e = {
                skill:{

                },
                character: c
            }
        }, this);
    }

    printEvents(){
        console.log(this.events);
    }

    sortTurnEvents(){
        this.turn.sort(util.createActionOrder);
    }

    executeTurnEvents(){
        this.turn.forEach( event => {
            console.log(event);
        }, this);
        // Actions are done
        this.events.push(this.turn); //Let's add this turn to events
        this.turn = [];
    }

    isOver(){
        
    }

}

module.exports = Battle;