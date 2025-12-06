class Buff {
    constructor(buffData) {
        this.name = buffData.name;
        this.state = $state(buffData.state);
        this.isActive = $state(buffData.isActive);
        this.isPermanent = buffData.isPermanent;
        this.duration = $state(buffData.duration);
    }
}

export default Buff;