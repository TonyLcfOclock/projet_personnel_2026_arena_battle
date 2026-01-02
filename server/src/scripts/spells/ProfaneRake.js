import Spell from "../Spell.js";
import Fight from "../utils/Fight.js";

class ProfaneRake extends Spell {
    constructor() {
        const spellData = {
            name: "Profane Rake",
            image: "/images/characters/monsters/boss/baron/spells_icon/profane_rake.png",
            description: "Perform a huge claw attack on the target, dealing damage, apply bleeding, 2 per turn, stackable, 3 turn duration.",
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

        let damage = Math.round(Fight.calculateCharacterDamage(self.statistics.STR, target.statistics.ARM) * 1.2);

        const targetBleedState = target.negativeEffects.find(negate => {
            return negate.name === 'Bleed';
        })

        if (!targetBleedState) return;

        targetBleedState.state = true;
        targetBleedState.duration = 3;
        targetBleedState.damage += 2;

        const damageEffect = target.perHit(target, self, damage);

        this.currentCooldown = this.cooldown;

        if (damageEffect.damage > 0) {
            const spellLog = {
                text: `${self.name} utilise Profane Rake et griffe ${target.name}, inflige ${damageEffect.damage} et applique un saignement! `,
                styles:
                    [
                        { word: `Profane`, color: 'red' },
                        { word: `Rake`, color: 'red' },
                        { word: `${damageEffect.damage}`, color: 'red' },
                        { word: `saignement`, color: 'red' }
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

export default ProfaneRake;