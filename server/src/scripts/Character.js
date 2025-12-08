class Characters {
    constructor(data) {
        this.name = data.name;
        this.image = data.image;
        this.statistics = data.statistics || {};
        this.selfAttributes = data.selfAttributes || {};
        this.passives = data.passives || [];
        this.buffs = data.buffs || [];
        this.negativeEffects = data.negativeEffects || [];
        this.spells = data.spells || [];
    }
}

export default Characters;