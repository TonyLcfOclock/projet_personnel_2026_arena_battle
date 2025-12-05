import { getRandomInt } from "./fight";

class Fight {
    fightingLogs = $state([]);
    
    constructor(name) {
        this.fightName = name;
    }

    addLogsLine(obj) {
        this.fightingLogs.push(obj);
    }

    buildLogsText(line) {
        const parts = line.text.split(/(\s+)/);

        return parts.map((part) => {
            const clean = part.replace(/[.,!?;:()"']/g, '');

            const style = line.styles.find(v => v.word === clean);
            return {
                text: part,
                style: style ? `color: ${style.color}; font-weight: bold` : ''
            }
        })
    }

    calculateCharacterHitChance(speed) {
        return Math.floor(Math.random() * speed);
    }

    chooseCharacterHitTurn(playerChance, enemyChance) {
        return playerChance > enemyChance; 
    }

    calculateCharacterCriticalChance(criticalChance) {
        return Math.random() < criticalChance;
    }

    calculateCharacterDamage(STR, ARM) {
        return Math.floor((STR * (100 / (100 + ARM))) + Math.random() * (STR / 10));
    }

    reduceCharacterSpellsCooldown(spells) {
        for (let key in spells) {
            let spell = spells[key];

            if (spell.currentCooldown > 0) {
                spell.currentCooldown--;
            }
        }
    }

    reduceCharacterNegativeEffectDuration(negate) { 
        if (!negate) return;

        negate.duration -= 1;

        if (negate.duration <= 0) {
            negate.state = false;
            negate.stacks = 0;
            negate.damage = 0;
            return;
        }
    }

    checkCharacterNegativeEffectStates(self) {
        let canPlay = true;

        if (self.negativeEffects.stun.state) {
            canPlay = false;
        }

        for (let key in self.negativeEffects) {
            if (self.negativeEffects[key].state && self.negativeEffects[key].duration >= 0) {
                self.negativeEffects[key].apply(self);
                this.reduceCharacterNegativeEffectDuration(self.negativeEffects[key])
            } 
        }

        return canPlay;
    }

    refreshCharacterBuff(target, self) {
        for (let key in self.buffs) {
            self.buffs[key].checkBuff(target, self);
        }
    }

    actionToDo(actionName, selfTarget, target) {
        if (!actionName) return;

        for (let key in selfTarget.spells) {
            if (selfTarget.spells[key].name === actionName) {
                selfTarget.spells[key].use(target, selfTarget);
                return;
            }
        }
    }

    randomAction(user, target) {
        const allSpells = Object.values(user.spells);

        const availableSpells = allSpells.filter(spell => {
            
            if (spell.currentCooldown > 0) return false;

            if (typeof spell.canUse === "function") {
                return spell.canUse(user, target);
            }

            return true;
        });

        if (availableSpells.length === 0) {
            return null; 
        }

        const randomIndex = getRandomInt(availableSpells.length);

        return availableSpells[randomIndex].name;
    }
}

export default Fight;