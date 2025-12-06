class Characters {
    constructor(data) {
        this.name = data.name;
        this.image = data.image;
        this.statistics = $state(data.statistics);
        this.selfAttributes = data.selfAttributes;
        this.passives = $state(data.passives || []);
        this.buffs = $state(data.buffs || []);
        this.negativeEffects = data.negativeEffects;
        this.spells = $state(data.spells || []);
    }

    perTurn(target, self) {
        this.passives.forEach(passive => {
            passive.onTurn(target, self);
        })
    }

    perHit(target, self, fightInstance) {
        this.passives.forEach(passive => {
            passive.onHit(target, self, fightInstance);
        })
    }
}

export default Characters;