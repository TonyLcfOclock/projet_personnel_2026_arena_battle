import Spell from "../Spell.js";

class sanguineOffering extends Spell {
    constructor() {
        const spellData = {
            name: "Sanguine Offering",
            image: undefined,
            description: "Sacrifice 5% max health for 25% bonus attack damage",
            castChance: 0.3,
            cooldown: 4,
            currentCooldown: 0,
            damageType: 'physical',
            type: 'self',
        };

        super(spellData);
    }

    logSpellAction(target, self, damage, fightInstance) {
        fightInstance.addLogsLine({
            text: `${self.name} utilise Sanguine Offering et sacrifie ${damage} points de vie, augmentant ses dégats de 25%`,
            styles:
                [
                    { word: `Sanguine`, color: 'red' },
                    { word: `Offering`, color: 'red' },
                    { word: `${damage}`, color: 'red' },
                    { word: `25%`, color: 'green' }
                ]
        });
    }

    canUseSpell(caster, target) {
        const cost = Math.round(caster.statistics.maxHP * 0.05);

        return (
            this.currentCooldown === 0 && caster.statistics.HP > cost + 1
        );
    }

    useSpell(target, self, fightInstance) {
        let damage = Math.round(self.statistics.maxHP * 0.05);

        self.statistics.STR += Math.round(self.statistics.STR * 0.25);

        self.statistics.HP -= damage;

        this.currentCooldown = this.cooldown;

        this.logSpellAction(target, self, damage, fightInstance);
    }
}

export default sanguineOffering;