import Debuff from "../Debuff.js";

class LowStrength extends Debuff {
    constructor() {
        const debuffData = {
            name: "Low Strength",
            state: false,
            isPermanent: false,
            duration: 0,
        }

        super(debuffData);
    }

    applyBuff(self, duration) {
        if (this.isPermanent) {
            return;
        }

        this.state = true;
        this.duration = duration;
    }

    checkBuff(self) {
        if (!this.state) {
            return;
        }

        if (this.duration > 0) {
            this.duration--;
        }

        if (this.duration === 0) {
            this.state = false;

            return
        }
    }
}

export default LowStrength;