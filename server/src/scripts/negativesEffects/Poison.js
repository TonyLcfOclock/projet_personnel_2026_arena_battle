import NegativeEffects from "../NegativeEffects.svelte.js";

class Poison extends NegativeEffects {
    constructor() {
        const effectsData = {
            name: "Poison",
            state: false,
            stacks: 0,
            duration: 0,
            damage: 0
        };

        super(effectsData);
    }

    logNegativeEffect(self, fightInstance) {
        fightInstance.addLogsLine({
            text: `${self.name} est empoisonné et subit ${this.damage} points de dégats d' empoisonnement!`,
            styles:
                [
                    { word: `${this.damage}`, color: 'purple' },
                    { word: `empoisonnement`, color: 'purple' }
                ]
        })
    }

    applyNegativeEffect(self, fightInstance) {
        self.statistics.HP -= this.damage;
        this.logNegativeEffect(self, fightInstance);
    }
}

export default Poison;