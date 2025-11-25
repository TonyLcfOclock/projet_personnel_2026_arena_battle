export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export function calculateChance(speed) {
    return Math.floor(Math.random() * speed);
}

export function calculateHitChance(playerChance, enemyChance) {
    return playerChance > enemyChance; 
}

export function calculateCriticalChance(criticalChance) {
    return Math.random() < criticalChance;
}

export function calculateDamage(STR, ARM) {
    return Math.floor((STR * (100 / (100 + ARM))) + Math.random() * (STR / 10));
}

export function reduceCooldown(spells) {
    for (let key in spells) {
        let spell = spells[key];

        if (spell.currentCooldown > 0) {
            spell.currentCooldown--;
        }
    }
}

export function reduceNegativeEffectDuration(negate) { 
    if (!negate) return;

    negate.duration -= 1;

    if (negate.duration <= 0) {
        negate.state = false;
        negate.stacks = 0;
        negate.damage = 0;
        return;
    }
}

export function checkStates(self) {
    let canPlay = true;

    if (self.negativeEffects.stun.state) {
        canPlay = false;
    }

    for (let key in self.negativeEffects) {
        if (self.negativeEffects[key].state && self.negativeEffects[key].duration >= 0) {
            self.negativeEffects[key].apply(self);
            reduceNegativeEffectDuration(self.negativeEffects[key])
        } 
    }

    return canPlay;
}

export function refreshBuff(target, self) {
    for (let key in self.buffs) {
        self.buffs[key].checkBuff(target, self);
    }
}

export function actionToDo(actionName, selfTarget, target) {
    if (!actionName) return;

    for (let key in selfTarget.spells) {
        if (selfTarget.spells[key].name === actionName) {
            selfTarget.spells[key].use(target, selfTarget);
            return;
        }
    }
}

export function randomAction(user, target) {
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