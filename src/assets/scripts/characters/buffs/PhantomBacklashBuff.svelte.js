import Buff from "../Buff.svelte.js";

class PhantomBacklashBuff extends Buff {
    constructor(buffData) {
        super(buffData)
    }

    applyBuff(target, self) {
        if (this.isPermanent) {
            return;
        }
        
        this.state = true;
        this.duration = 2;
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
            return
        }
    }
}

export default PhantomBacklashBuff;