import Buff from "../Buff.svelte.js";

class PhantomBacklashBuff extends Buff {
    constructor(buffData) {
        super(buffData)
    }

    applyBuff(target, self) {
        if (this.isPermanent) {
            return;
        }

        if (this.state) {
            this.duration = 2;
        }
    }
    
    checkBuff(target, self) {
        if (this.state && !this.isActive) {
            this.isActive = true;
            this.applyBuff(target, self);
            return
        }

        if (this.duration > 0) {
            this.duration--;
        }

        if (this.duration === 0 && this.isActive) {
            this.state = false;
            this.isActive = false;
            return
        }
    }
}

export default PhantomBacklashBuff;