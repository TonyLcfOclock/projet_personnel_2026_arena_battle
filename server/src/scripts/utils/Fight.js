import Utilities from "./Utilities.js";

// import des personnages
import DeathKnight from "../characters/DeathKnight.js";
import Baron from "../characters/Baron.js";
import DimensionalDevourer from "../characters/DimensionalDevourer.js";

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

    // méthode static qui créer les personnages à la volée
    static createCharacter(char) {
        let character;

        switch(char.className) {
            case "DeathKnight":
                character = new DeathKnight(char.name);
                break;
            case "Baron":
                character = new Baron(char.name);
                break;
            case "Dimensional Devourer":
                character = new DimensionalDevourer(char.name);
                break;
        }

        character.statistics = char.statistics;

        if (character.passives.length) {
            character.passives.forEach(passive => {
                const charPassive = char.passives.find(element => element.name === passive.name);
                passive.display = charPassive.display;
                passive.stacks = charPassive.stacks;
            })
        }

        if (character.buffs.length) {
            character.buffs.forEach(buff => {
                const charBuff = char.buffs.find(element => element.name === buff.name);
                buff.state = charBuff.state;
                buff.isActive = charBuff.isActive;
                buff.isPermanent = charBuff.isPermanent;
                buff.duration = charBuff.duration;
            })
        }

        if (character.negativeEffects.length) {
            character.negativeEffects.forEach(negate => {
                const charNegate = char.negativeEffects.find(element => element.name === negate.name);
                negate.state = charNegate.state;
                negate.stacks = charNegate.stacks;
                negate.duration = charNegate.duration;
                negate.damage = charNegate.damage;
            })
        }

        if (character.spells.length) {
            character.spells.forEach(spell => {
                const charSpell = char.spells.find(element => element.name === spell.name);
                spell.castChance = charSpell.castChance;
                spell.cooldown = charSpell.cooldown;
                spell.currentCooldown = charSpell.currentCooldown;
            });
        }

        return character;
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