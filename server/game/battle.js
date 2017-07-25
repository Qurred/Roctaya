class Battle{
    constructor(teamA, teamB){
        this.teamA = teamA;
        this.teamB = teamB;
        this.events = []
    }

    printEvents(){
        console.log(this.events);
    }

    sortEvents(){
        
    }
}

module.exports = Battle;