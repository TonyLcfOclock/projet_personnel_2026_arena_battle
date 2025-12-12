import NegativeEffects from "../NegativeEffects.js";

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

    applyNegativeEffect(self) {
        self.statistics.HP -= this.damage;
        
        return {
            text: `${self.name} saigne et subit ${this.damage} points de dégats de saignement!`,
            styles:
                [
                    { word: `${this.damage}`, color: 'red' },
                    { word: `saignement`, color: 'red' }
            ]
        }
    }
}

export default Bleed;