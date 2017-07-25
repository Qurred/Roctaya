class Battle{
    constructor(teamA, teamB){
        this.teamA = teamA;
        this.teamB = teamB;
        this.events = []
        this.printEvents();
    }

    printEvents(){
        console.log(this.events);
    }
}

module.exports = Battle;