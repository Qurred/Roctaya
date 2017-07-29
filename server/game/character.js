class Character{
    constructor(id, name, health, mana,
        defence, speed, attack, intellect, sanity, xp
    ){
        this.id = id;
        this.name = name;
        this.healt = health;
        this.mana = mana;
        this.defence = defence;
        this.speed = speed;
        this.attack = attack;
        this.intellect = intellect;
        this.sanity = sanity;
        this.statusAilments = [];
        this.levelUp(xp);
        // console.log(this);
    }

    levelUp(xp){
        const scale = 3/39;
        const level = Math.floor((2/9) * Math.sqrt(xp));
        this.healt += Math.floor(this.health*scale * level);
        this.mana +=  Math.floor(this.mana*scale * level);
        this.defence +=  Math.floor(this.defence*scale * level);
        this.speed +=  Math.floor(this.speed*scale * level);
        this.attack +=  Math.floor(this.attack*scale * level);;
        this.intellect +=  Math.floor(this.intellect*scale * level);
        this.sanity +=  Math.floor(this.sanity*scale * level);
        // console.log(level);
    }
}

module.exports = Character;