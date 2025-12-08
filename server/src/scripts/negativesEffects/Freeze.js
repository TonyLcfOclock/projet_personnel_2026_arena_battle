import NegativeEffects from "../NegativeEffects.js";

class Freeze extends NegativeEffects {
    constructor() {
        const effectsData = {
            name: "Freeze",
            state: false,
            stacks: 0,
            duration: 0,
            damage: 0
        };

        super(effectsData);
    }

    logNegativeEffect(self, fightInstance) {
        fightInstance.addLogsLine({
            text: `${self.name} est gelé et subit ${this.damage} points de dégats de gel!`,
            styles:
                [
                    { word: `${this.damage}`, color: 'lightblue' },
                    { word: `gel`, color: 'lightblue' }
                ]
        })
    }

    applyNegativeEffect(self, fightInstance) {
        self.statistics.HP -= this.damage;
        this.logNegativeEffect(self, fightInstance);
    }
}

export default Freeze;