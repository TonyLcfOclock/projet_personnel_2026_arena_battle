import Spell from "../Spell.svelte.js";

class PiercingStrike extends Spell {
    constructor(spellData) {
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