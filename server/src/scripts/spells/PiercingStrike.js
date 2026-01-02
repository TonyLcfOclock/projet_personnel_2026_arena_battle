import Spell from "../Spell.js";
import Fight from "../utils/Fight.js";

class PiercingStrike extends Spell {
    constructor() {
        const spellData = {
            name: "Piercing Strike",
            image: "/images/characters/humans/classes/death_knight/spells_icons/piercing_strike.png",
            description: "Piercing Strike on the enemy head, dealing 100 dmg",
            castChance: 0.15,
            cooldown: 2,
            currentCooldown: 0,
            damageType: 'physical',
            type: 'enemy',
        };

        super(spellData);
    }

    canUseSpell(caster, target) {
        return this.currentCooldown === 0;
    }

    useSpell(target, self) {
        const log = [];

        let soulsPassive = self.passives.find(element => element.name === "Souls");

        if (soulsPassive) {
            soulsPassive.stacks++;
        }

        let damage = Math.round(Fight.calculateCharacterDamage(self.statistics.STR, target.statistics.ARM) * 1.2);
        
        const damageEffect = target.perHit(target, self, damage);

        this.currentCooldown = this.cooldown;

        if (damageEffect.damage > 0) {
            let spellLog = {
                text: `${self.name} utilise ${this.name} et inflige ${damageEffect.damage} points de dégats à ${target.name}`,
                styles:
                    [
                        { word: `Piercing`, color: 'grey' },
                        { word: `Strike`, color: 'grey' },
                        { word: `${damageEffect.damage}`, color: 'yellow' }
                ]
            }

            log.push(spellLog);
        }

        if (damageEffect.log) {
            damageEffect.log.forEach(element => log.push(element));
        }

        return log;
    }
}

export default PiercingStrike;