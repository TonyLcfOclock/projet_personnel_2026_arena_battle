class Spell {
    constructor(spellData) {
        this.name = spellData.name;
        this.image = spellData.image;
        this.description = spellData.description;
        this.castChance = spellData.castChance;
        this.cooldown = spellData.cooldown;
        this.currentCooldown = spellData.currentCooldown;
        this.damageType = spellData.damageType;
        this.type = spellData.type;
    }
}

export default Spell;