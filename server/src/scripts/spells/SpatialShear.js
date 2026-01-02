import Spell from "../Spell.js";
import Fight from "../utils/Fight.js";

class SpatialShear extends Spell {
    constructor() {
        const spellData = {
            name: "Spatial Shear",
            image: "/images/characters/monsters/boss/dimensional_devourer/spells_icon/spatial_shear.png",
            description: "Ignore 33% of the target armor, deal damage to the target and grant rift stacks",
            castChance: 0.3,
            cooldown: 2,
            currentCooldown: 0,
            damageType: 'magical',
            type: 'enemy'
        };

        super(spellData);
    }

    canUseSpell(caster) {
        return this.currentCooldown === 0;
    }

    useSpell(target, self) {
        const log = [];

        let damage = Fight.calculateCharacterDamage(self.statistics.STR, target.statistics.ARM * 0.66);

        let riftPassive = self.passives.find(element => element.name === "Rift Charge");

        if (riftPassive) {
            riftPassive.stacks += 1;
        }

        const damageEffect = target.perHit(target, self, damage);

        this.currentCooldown = this.cooldown;

        if (damageEffect.damage > 0) {
            const spellLog = {
                text: `${self.name} utilise Spatial Shear et inflige ${damageEffect.damage} points de dégats`,
                styles:
                    [
                        { word: `Spatial`, color: 'purple' },
                        { word: `Shear`, color: 'purple' },
                        { word: `${damageEffect.damage}`, color: 'purple' }
                    ]
            };

            log.push(spellLog);
        }

        if (damageEffect.log) {
            damageEffect.log.forEach(element => log.push(element));
        }

        return log;
    }
}

export default SpatialShear;