class Characters {
    constructor(data) {
        this.name = data.name;
        this.className = data.className;
        this.typeName = data.typeName; // Résistances à l'avenir ?
        this.image = data.image;
        this.description = data.description;
        this.avatar = data.avatar;
        this.statistics = data.statistics || {};
        this.passives = data.passives || [];
        this.buffs = data.buffs || [];
        this.negativeEffects = data.negativeEffects || [];
        this.spells = data.spells || [];
    }
}

export default Characters;