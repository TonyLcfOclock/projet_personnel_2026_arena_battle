class Characters {
    constructor(data) {
        this.name = data.name;
        this.image = data.image;
        this.statistics = $state(data.statistics);
        this.selfAttributes = $state(data.selfAttributes);
        this.passives = $state(data.passives || []);
        this.buffs = $state(data.buffs || []);
        this.negativeEffects = data.negativeEffects;
        this.spells = $state(data.spells || []);
    }
}

export default Characters;