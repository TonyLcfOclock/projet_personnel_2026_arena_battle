import Spell from "../Spell.js";
import Fight from "../utils/Fight.js";

class SpectralStrike extends Spell {
    constructor() {
        const spellData = {
            name: "Spectral Strike",
            image: "/images/characters/humans/classes/death_knight/spells_icons/spectral_strike.png",
            description: "Dealing some DMG + 25% missing health of the target",
            castChance: 0.15,
            cooldown: 5,
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

        let targetHP = target.statistics.maxHP - target.statistics.HP;
        let percentMissingHealthDamage = Math.round(targetHP * 0.25);

        let damage = Math.round(Fight.calculateCharacterDamage(self.statistics.STR, target.statistics.ARM) / 2 + percentMissingHealthDamage);
        
        const damageEffect = target.perHit(target, self, damage);

        this.currentCooldown = this.cooldown;
        
        if (damageEffect.damage > 0) {
            let spellLog = {
                text: `${self.name} utilise ${this.name} et inflige ${damageEffect.damage} points de dégats à ${target.name}`,
                styles:
                    [
                        { word: `Spectral`, color: 'grey' },
                        { word: `Strike`, color: 'grey' },
                        { word: `${damageEffect.damage}`, color: 'grey' }
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

export default SpectralStrike;