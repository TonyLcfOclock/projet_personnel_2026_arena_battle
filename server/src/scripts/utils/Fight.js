import Utilities from "./Utilities.js";

class Fight {

    static calculateCharacterHitChance(speed) {
        return Math.floor(Math.random() * speed);
    }

    static chooseCharacterHitTurn(playerChance, enemyChance) {
        return playerChance > enemyChance; 
    }

    static calculateCharacterCriticalChance(criticalChance) {
        return Math.random() < criticalChance;
    }

    static calculateCharacterDamage(STR, ARM) {
        return Math.floor((STR * (100 / (100 + ARM))) + Math.random() * (STR / 10));
    }

    static reduceCharacterSpellsCooldown(spells) {
        spells.forEach(spell => {
            if (spell.currentCooldown > 0) {
                spell.currentCooldown--;
            }
        })
    }

    static reduceCharacterNegativeEffectDuration(negate) { 
        if (!negate) return;

        negate.duration -= 1;

        if (negate.duration <= 0) {
            negate.state = false;
            negate.stacks = 0;
            negate.damage = 0;
            return;
        }
    }

    static checkCharacterNegativeEffectStates(self, fightInstance) {
        let canPlay = true;

        const stunNegate = self.negativeEffects.find(element => {
            return element.name === 'Stun';
        })

        if (stunNegate.state) {
            canPlay = false;
        }

        self.negativeEffects.forEach(negate => {
            if (negate.state && negate.duration >= 0) {
                negate.applyNegativeEffect(self, fightInstance);
                this.reduceCharacterNegativeEffectDuration(negate);
            }
        })

        return canPlay;
    }

    static refreshCharacterBuff(target, self) {
        self.buffs.forEach(buff => {
            buff.checkBuff(target, self);
        })
    }

    static actionToDo(actionName, selfTarget, target, fightInstance) {
        if (!actionName) return;

        selfTarget.spells.forEach(spell => {
            if (actionName === spell.name) {
                spell.useSpell(target, selfTarget, fightInstance)
            }
        })
    }

    static randomAction(user, target) {
        const availableSpells = user.spells.filter(spell => {
            
            if (spell.currentCooldown > 0) return false;

            if (typeof spell.canUseSpell === "function") {
                return spell.canUseSpell(user, target);
            }

            return true;
        });

        if (availableSpells.length === 0) {
            return null; 
        }

        const randomIndex = Utilities.getRandomInt(availableSpells.length);

        return availableSpells[randomIndex].name;
    }
}

export default Fight;