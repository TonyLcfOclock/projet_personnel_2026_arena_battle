import Spell from "../Spell.js";
import Fight from "../utils/Fight.js";

class VoidstepAssault extends Spell {
    constructor() {
        const spellData = {
            name: "Voidstep Assault",
            image: "/images/characters/monsters/boss/dimensional_devourer/spells_icon/voidstep_assault.png",
            description: "Gain +15% speed for 3 turn, consume 1 stack of rift passive",
            castChance: 0.3,
            cooldown: 4,
            currentCooldown: 0,
            damageType: 'magical',
            type: 'self'
        };

        super(spellData);
    }

    canUseSpell(caster) {
        return this.currentCooldown === 0;
    }

    useSpell(target, self) {
        const log = [];

        let damage = 0;

        let riftPassive = self.passives.find(element => element.name === "Rift Charge");

        if (riftPassive) {
            riftPassive.stacks -= 1;
        }

        let highSpeed = self.buffs.find(element => element.name === "High Speed");

        if (highSpeed) {
            highSpeed.applyBuff(self, 2, 0.15, 'Voidstep');
        }

        const damageEffect = target.perHit(target, self, damage);

        this.currentCooldown = this.cooldown;

        if (damageEffect.damage >= 0) {
            const spellLog = {
                text: `${self.name} utilise Voidstep Assault et augmente sa vitesse de 15%`,
                styles:
                    [
                        { word: `Voidstep`, color: 'purple' },
                        { word: `Assault`, color: 'purple' },
                        { word: `15%`, color: 'purple' }
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

export default VoidstepAssault;