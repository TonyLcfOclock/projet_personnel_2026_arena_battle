import Spell from "../Spell.js";
import Fight from "../utils/Fight.js";

class SanguineBite extends Spell {
    constructor() {
        const spellData = {
            name: "Sanguine Bite",
            image: "/images/characters/monsters/boss/baron/spells_icon/sanguine_bite.png",
            description: "Bite the target, 10 dmg, apply bleeding, 5 dmg per turn, stackable. 3 turn duration",
            castChance: 0.3,
            cooldown: 2,
            currentCooldown: 0,
            damageType: 'physical',
            type: 'enemy',
        };

        super(spellData);
    }

    canUseSpell(caster) {
        return this.currentCooldown === 0;
    }

    useSpell(target, self) {
        const log = [];

        let damage = Math.round(Fight.calculateCharacterDamage(self.statistics.STR, target.statistics.ARM) / 4);

        const targetBleedState = target.negativeEffects.find(negate => {
            return negate.name === 'Bleed';
        })

        if (!targetBleedState) return;

        targetBleedState.state = true;
        targetBleedState.duration = 3;
        targetBleedState.damage += 4;

        const damageEffect = target.perHit(target, self, damage);

        this.currentCooldown = this.cooldown;

        if (damageEffect.damage > 0) {
            const spellLog = {
                text: `${self.name} utilise Sanguine Bite et mord ${target.name}, inflige ${damageEffect.damage} et applique un saignement!`,
                styles:
                    [
                        { word: `Sanguine`, color: 'red' },
                        { word: `Bite`, color: 'red' },
                        { word: `${damageEffect.damage}`, color: 'red' },
                        { word: `saignement`, color: 'red' }
                ]
            };

            log.push(spellLog);
        }

        if (damageEffect.log) {
            damageEffect.log.forEach(element => log.push(element));
        }

        return log
    }
}

export default SanguineBite;