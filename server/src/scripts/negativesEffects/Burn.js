import NegativeEffects from "../NegativeEffects.js";

class Burn extends NegativeEffects {
    constructor() {
        const effectsData = {
            name: "Burn",
            state: false,
            stacks: 0,
            duration: 0,
            damage: 0
        };

        super(effectsData);
    }

    logNegativeEffect(self, fightInstance) {
        fightInstance.addLogsLine({
            text: `${self.name} brûle et subit ${this.damage} points de dégats de brûlure!`,
            styles:
                [
                    { word: `${this.damage}`, color: 'orange' },
                    { word: `brûlure`, color: 'orange' }
                ]
        })
    }

    applyNegativeEffect(self, fightInstance) {
        self.statistics.HP -= this.damage;
        this.logNegativeEffect(self, fightInstance);
    }
}

export default Burn;