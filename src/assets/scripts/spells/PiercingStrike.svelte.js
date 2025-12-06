import Spell from "../Spell.svelte.js";

class PiercingStrike extends Spell {
    constructor() {
        const spellData = {
            name: "Piercing Strike",
            image: "./src/assets/art/characters/humans/classes/death_knight/spells_icons/piercing_strike.png",
            description: "Piercing Strike on the enemy head, dealing 100 dmg",
            castChance: 0.15,
            cooldown: 2,
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
                    { word: `Piercing`, color: 'grey' },
                    { word: `Strike`, color: 'grey' },
                    { word: `${damage}`, color: 'yellow' }
                ]
        });
    }

    canUseSpell(caster, target) {
        return this.currentCooldown === 0;
    }

    useSpell(target, self, fightInstance) {
        self.selfAttributes.Souls++;
        let damage = Math.round(fightInstance.calculateCharacterDamage(self.statistics.STR, target.statistics.ARM) * 1.2);
        target.statistics.HP -= damage;

        this.currentCooldown = this.cooldown;

        this.logSpellAction(target, self, damage, fightInstance);
    }
}

export default PiercingStrike;