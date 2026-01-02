import Buff from "../Buff.js";

class CounterStrike extends Buff {
    constructor() {
        const buffData = {
            name: "Counter Strike",
            state: false,
            isActive: false,
            isPermanent: false,
            duration: 0,
        }
        
        super(buffData);
    }

    applyBuff(self) {
        if (this.isPermanent) {
            return;
        }

        this.state = true;
        this.duration = 0;
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

export default CounterStrike;