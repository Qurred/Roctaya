const util = require('./util');

class Battle{
    constructor(teamA, teamB){
        this.teamA = teamA;
        this.teamB = teamB;
        this.events = [];
        this.turn = [];
        //Just for testing purpose
        for(let i = 0; i < 8; i++){
            this.turn.push({
                skill:{
                    priority: 100 * Math.random()
                },
                character:{
                    speed:10** Math.random()
                }
            })
        }
        this.sortTurnEvents();
        this.executeTurnEvents();
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


}

module.exports = Battle;