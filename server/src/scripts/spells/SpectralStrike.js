import Spell from "../Spell.svelte.js";

class SpectralStrike extends Spell {
    constructor() {
        const spellData = {
            name: "Spectral Strike",
            image: "./src/assets/art/characters/humans/classes/death_knight/spells_icons/spectral_strike.png",
            description: "Dealing some DMG + 25% missing health of the target",
            castChance: 0.15,
            cooldown: 5,
            currentCooldown: 0,
            damageType: 'physical',
            type: 'enemy',
        };

        super(spellData);
    }

    logSpellAction(target, self, damage, fightInstance) {
        fightInstance.addLogsLine({
            text: `${self.name} utilise ${this.name} et inflige ${damage} points de dégats à ${target.name}`,
            styles:
                [
                    { word: `Spectral`, color: 'grey' },
                    { word: `Strike`, color: 'grey' },
                    { word: `${damage}`, color: 'grey' }
                ]
        });
    }

    canUseSpell(caster, target) {
        return this.currentCooldown === 0;
    }

    useSpell(target, self, fightInstance) {
        let targetHP = target.statistics.maxHP - target.statistics.HP;
        let percentMissingHealthDamage = Math.round(targetHP * 0.25);

        let damage = Math.round(fightInstance.calculateCharacterDamage(self.statistics.STR, target.statistics.ARM) / 2 + percentMissingHealthDamage);
        target.statistics.HP -= damage;

        this.currentCooldown = this.cooldown;

        this.logSpellAction(target, self, damage, fightInstance);
    }
}

export default SpectralStrike;