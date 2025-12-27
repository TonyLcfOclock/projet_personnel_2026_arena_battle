import Spell from "../Spell.js";

class Overpower extends Spell {
    constructor() {
        const spellData = {
            name: "Overpower",
            image: "/images/characters/humans/classes/death_knight/spells_icons/overpower.png",
            description: "+30% bonus speed and +30% bonus attack damage",
            castChance: 0.4,
            cooldown: 6,
            currentCooldown: 0,
            damageType: 'none',
            type: 'self'
        };

        super(spellData);
    }

    canUseSpell(caster) {
        const overpower = caster.buffs.find(element => {
            return element.name === "High Speed";
        });

        return this.currentCooldown === 0 && overpower;
    }

    useSpell(target, self, battle) {
        const log = [];

        let damage = 0;
        this.currentCooldown = this.cooldown;

         const overpower = self.buffs.find(element => {
            return element.name === "High Speed";
        });

        overpower.applyBuff(self);

        const spellLog = {
            text: `${self.name} utilise Overpower et s'octroie un bonus de vitesse et de dégats supplémentaire de 30%`,
            styles:
                [
                    { word: `Overpower`, color: 'grey' },
                    { word: `vitesse`, color: 'grey' },
                    { word: `dégats`, color: 'grey' },
                    { word: `30%`, color: 'green' }
                ]
        }

        log.push(spellLog);

        return log;
    }
}

export default Overpower;