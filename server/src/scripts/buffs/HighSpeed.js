import Buff from "../Buff.js";

class HighSpeed extends Buff {
    constructor() {
        const buffData = {
            name: "High Speed",
            state: false,
            isActive: false,
            isPermanent: false,
            duration: 0,
            quantity: 0
        }

        super(buffData);
    }

    applyBuff(self, duration, quantity, name = this.name) {
        if (this.isPermanent) {
            return;
        }

        this.state = true;
        // this.name = name;
        this.duration = duration;
        this.quantity = quantity;
        
        self.statistics.speed += Math.round(self.statistics.speed * this.quantity);
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
            self.statistics.speed = Math.round(self.statistics.speed / (1 + this.quantity));
            this.name = "High Speed";
            return
        }
    }
}

export default HighSpeed;