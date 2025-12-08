import Buff from "../Buff.js";

class HighSpeed extends Buff {
    constructor() {
        const buffData = {
            name: "High Speed",
            state: false,
            isActive: false,
            isPermanent: false,
            duration: 0,
        }

        super(buffData);
    }

    applyBuff(target, self) {
        if (this.isPermanent) {
            return;
        }

        this.state = true;
        this.duration = 5;
        self.statistics.speed += Math.round(self.statistics.speed * 0.3);
    }

    checkBuff(target, self) {
        if (!this.state) {
            return;
        }

        if (this.duration > 0) {
            this.duration--;
        }

        if (this.duration === 0) {
            this.state = false;

            self.statistics.speed = Math.round(self.statistics.speed / 1.3);
            return
        }
    }
}

export default HighSpeed;