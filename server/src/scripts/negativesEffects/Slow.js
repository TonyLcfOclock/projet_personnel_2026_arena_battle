import NegativeEffects from "../NegativeEffects.js";

class Slow extends NegativeEffects {
    constructor() {
        const effectsData = {
            name: "Slow",
            state: false,
            stacks: 0,
            duration: 0,
            damage: 0
        };

        super(effectsData);
    }

    logNegativeEffect(self, fightInstance) {
        fightInstance.addLogsLine({
            text: `${self.name} est ralentit et a du mal à avancer`,
            styles:
                []
        })
    }

    applyNegativeEffect(self, fightInstance) {
        self.statistics.HP -= this.damage;
        this.logNegativeEffect(self, fightInstance);
    }
}

export default Slow;