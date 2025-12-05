class Characters {
    constructor(data) {
        this.name = data.name;
        this.image = data.image;
        this.statistics = $state(data.statistics);
        this.selfAttributes = data.selfAttributes;
        this.passives = $state([]);
        this.buffs = data.buffs;
        this.negativeEffects = data.negativeEffects;
        this.spells = data.spells;
    }

    perTurn(target, self) {
        this.passives.forEach(passive => {
            passive.onTurn(target, self);
        })
    }
}

export default Characters;