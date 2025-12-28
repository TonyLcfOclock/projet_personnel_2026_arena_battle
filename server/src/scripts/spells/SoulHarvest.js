import Spell from "../Spell.js";

class SoulHarvest extends Spell {
    constructor() {
        const spellData = {
            name: "Soul Harvest",
            image: "/images/characters/humans/classes/death_knight/spells_icons/soul_harvest.png",
            description: "Steal soul's fragment of the target, dealing damage and healing himself for 10% of this amount",
            castChance: 0.3,
            cooldown: 3,
            currentCooldown: 0,
            damageType: 'magical',
            type: 'enemy'
        };

        super(spellData);
    }

    canUseSpell(caster) {
        return this.currentCooldown === 0;
    }

    useSpell(target, self, battle) {
        const log = [];

        let damage = battle.fight.calculateCharacterDamage(self.statistics.STR, target.statistics.ARM);
        let healing = Math.floor(damage * 0.10);
        if (self.statistics.HP >= self.statistics.maxHP) {
            healing = 0;
        }

        let soulsPassive = self.passives.find(element => element.name === "Souls");

        if (soulsPassive) {
            soulsPassive.stacks += 5;
        }

        self.statistics.HP += healing

        const damageEffect = target.perHit(target, self, battle, damage);

        this.currentCooldown = this.cooldown;

        if (damageEffect.damage > 0) {
            const spellLog = {
                text: `${self.name} utilise Soul Harvest, inflige ${damageEffect.damage} points de dégats et se soigne de ${healing} points de vie`,
                styles:
                    [
                        { word: `Soul`, color: 'grey' },
                        { word: `Harvest`, color: 'grey' },
                        { word: `${damageEffect.damage}`, color: 'orange' },
                        { word: `${healing}`, color: 'green' }
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

export default SoulHarvest;