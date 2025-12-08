class Buff {
    constructor(buffData) {
        this.name = buffData.name;
        this.state = buffData.state;
        this.isActive = buffData.isActive;
        this.isPermanent = buffData.isPermanent;
        this.duration = buffData.duration;
    }
}

export default Buff;