import Spell from "../Spell.js";

class ProfaneRake extends Spell {
    constructor() {
        const spellData = {
            name: "Profane Rake",
            image: undefined,
            description: "Perform a huge claw attack on the target, dealing damage, apply bleeding, 2 per turn, stackable, 3 turn duration.",
            castChance: 0.3,
            cooldown: 2,
            currentCooldown: 0,
            damageType: 'physical',
            type: 'enemy',
        };

        super(spellData);
    }

    logSpellAction(target, self, damage, fightInstance) {
        fightInstance.addLogsLine({
            text: `${self.name} utilise Profane Rake et griffe ${target.name}, inflige ${damage} et applique un saignement! `,
            styles:
                [
                    { word: `Profane`, color: 'red' },
                    { word: `Rake`, color: 'red' },
                    { word: `${damage}`, color: 'red' },
                    { word: `saignement`, color: 'red' }
                ]
        });
    }

    canUseSpell(caster, target) {
        return this.currentCooldown === 0;
    }

    useSpell(target, self, fightInstance) {
        let damage = Math.round(fightInstance.calculateCharacterDamage(self.statistics.STR, target.statistics.ARM) * 1.2);

        const targetBleedState = target.negativeEffects.find(negate => {
            return negate.name === 'Bleed';
        })

        if (!targetBleedState) return;


        targetBleedState.state = true;
        targetBleedState.duration = 3;
        targetBleedState.damage += 2;

        target.statistics.HP -= damage;

        this.currentCooldown = this.cooldown;

        this.logSpellAction(target, self, damage, fightInstance);
    }
}

export default ProfaneRake;