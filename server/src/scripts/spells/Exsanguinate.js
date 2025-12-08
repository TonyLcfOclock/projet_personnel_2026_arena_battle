import Spell from "../Spell.js";

class Exsanguinate extends Spell {
    constructor() {
        const spellData = {
            name: "Exsanguinate",
            image: undefined,
            description: "10% missing health healing, apply 10 dmg per turn bleeding on the caster, stackable. 10 turn duration",
            castChance: 0.3,
            cooldown: 6,
            currentCooldown: 0,
            damageType: 'physical',
            type: 'self',
        };

        super(spellData);
    }

    logSpellAction(target, self, healing, fightInstance) {
        fightInstance.addLogsLine({
            text: `${self.name} utilise Exsanguinate et se soigne de ${healing} points de vie!, ${self.name} saigne!`,
            styles:
                [
                    { word: `Exsanguinate`, color: 'red' },
                    { word: `soigne`, color: 'red' },
                    { word: `${healing}`, color: 'green' },
                    { word: `saigne!`, color: 'red' }
                ]
        });
    }

    canUseSpell(caster, target) {
        return (
            this.currentCooldown === 0 && caster.statistics.hp >= caster.statistics.maxHP
        );
    }

    useSpell(target, self, fightInstance) {
        let healing = Math.round((self.statistics.maxHP - self.statistics.HP) * 0.1);

        self.statistics.HP += healing;

        this.currentCooldown = this.cooldown;

        this.logSpellAction(target, self, healing, fightInstance);
    }
}

export default Exsanguinate;