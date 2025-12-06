import Passive from "../Passive.svelte.js";

class Souls extends Passive {
    constructor(name) {
        super(name);
    }

    onTurn(target, self) { // méthode appelée au début du tour du personnage, gère les passifs du personnage
        self.statistics.STR = Math.floor(self.statistics.STR + (0.5 * self.selfAttributes.Souls));
        self.statistics.ARM = Math.floor(self.statistics.ARM + (0.5 * self.selfAttributes.Souls));
        self.statistics.speed = Math.floor(self.statistics.speed + (0.1 * self.selfAttributes.Souls));
        self.statistics.CritChance = self.statistics.CritChance + (0.01 * self.selfAttributes.Souls);
        self.statistics.CritDamage = self.statistics.CritDamage + (0.01 * self.selfAttributes.Souls);
    }

    onHit(target, self, fightInstance) {} // méthode appelée dès que le personnage prends un coups, gère les réactions à ce dernier
}

export default Souls;