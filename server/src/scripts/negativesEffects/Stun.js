import NegativeEffects from "../NegativeEffects.svelte.js";

class Stun extends NegativeEffects {
    constructor() {
        const effectsData = {
            name: "Stun",
            state: false,
            stacks: 0,
            duration: 0,
            damage: 0
        };

        super(effectsData);
    }

    logNegativeEffect(self, fightInstance) {
        fightInstance.addLogsLine({
            text: `${self.name} est paralysé et ne peut pas attaquer`,
            styles:
                [
                    { word: `paralysé`, color: 'yellow' }
                ]
        })
    }

    applyNegativeEffect(self, fightInstance) {
        self.statistics.HP -= this.damage;
        this.logNegativeEffect(self, fightInstance);
    }
}

export default Stun;