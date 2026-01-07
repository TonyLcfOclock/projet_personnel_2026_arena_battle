import Spell from "../Spell.js";

class PhantomBacklash extends Spell {
    constructor() {
        const spellData = {
            name: "Phantom Backlash",
            image: "/images/characters/humans/classes/death_knight/spells_icons/phantom_backlash.png",
            description: "Activate counterattack for 2 turns. Counterattack dealing -50% attack damage. Can't fail.",
            castChance: 0.3,
            cooldown: 4,
            currentCooldown: 0,
            damageType: 'physical',
            type: 'self'
        };

        super(spellData);
    }

    canUseSpell(caster) {
        const counterStrike = caster.buffs.find(element => {
            return element.name === "Counter Strike";
        });

        return (
            this.currentCooldown === 0 && counterStrike
        );
    }

    useSpell(target, self) {
        const log = [];

        let damage = 0;
        this.currentCooldown = this.cooldown;
        
        const counterStrike = self.buffs.find(element => {
            return element.name === "Counter Strike";
        });

        counterStrike.applyBuff(self, 3);

        let spellLog = {
            text: `${self.name} utilise Phantom Backlash et se prépare à riposter pendant 2 tours`,
            styles:
                [
                    { word: `Phantom`, color: 'grey' },
                    { word: `Backlash`, color: 'grey' },
                    { word: `riposter`, color: 'orange' },
                    { word: `2`, color: 'green' }
                ]
        }

        log.push(spellLog);

        return log;
    }
}

export default PhantomBacklash;