import Passive from "../Passive.svelte.js";

class CounterStrikePassive extends Passive {
    constructor() {
        super('Counter Strike');
    }

    onTurn(target, self) {} // méthode appelée au début du tour du personnage, gère les passifs du personnage

    onHit(target, self, fightInstance) { // méthode appelée dès que le personnage prends un coups, gère les réactions à ce dernier
        if (self.buffs[0].state /*!self.negativeEffects.stun.state*/) {

            let damage = Math.round(fightInstance.calculateCharacterDamage(self.statistics.STR, target.statistics.ARM) / 2);
            target.statistics.HP -= damage;

            fightInstance.addLogsLine({
                text: `${self.name} contre attaque et inflige ${damage} points de dégâts`,
                styles:
                    [
                        { word: `contre`, color: 'grey' },
                        { word: `attaque`, color: 'grey' },
                        { word: `${damage}`, color: 'yellow' },
                    ]
            });
        }
    }
}

export default CounterStrikePassive;