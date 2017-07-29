class StatusAilment{
    constructor(
        effectType,
        duration,
        amount
    ){
        this.effectType = effectType;
        this.duration = duration;
        this.amount = amount;
    }

    update(){
        // Here we should do everything needed for effect if DoT
        duration--;
    }


}

module.exports = StatusAilment;