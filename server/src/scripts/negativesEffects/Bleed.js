import NegativeEffects from "../NegativeEffects.svelte.js";

class Bleed extends NegativeEffects {
    constructor() {
        const effectsData = {
            name: "Bleed",
            state: false,
            stacks: 0,
            duration: 0,
            damage: 0
        };

        super(effectsData);
    }

    logNegativeEffect(self, fightInstance) {
        fightInstance.addLogsLine({
            text: `${self.name} saigne et subit ${this.damage} points de dégats de saignement!`,
            styles:
                [
                    { word: `${this.damage}`, color: 'red' },
                    { word: `saignement`, color: 'red' }
                ]
        })
    }

    applyNegativeEffect(self, fightInstance) {
        self.statistics.HP -= this.damage;
        this.logNegativeEffect(self, fightInstance);
    }
}

export default Bleed;