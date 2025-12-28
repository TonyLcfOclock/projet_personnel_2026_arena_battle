import Passive from "../Passive.js";

class RiftChargePassive extends Passive {
    constructor() {
        const data = {
            name: 'Rift Charge',
            display: true,
            description: "Gathered Souls, give stats to the DeathKnight",
            stacks: 1
        }

        super(data);
    }

    onTurn(target, self) {} // méthode appelée au début du tour du personnage, gère les passifs du personnage

    onHit(target, self) {} // méthode appelée dès que le personnage prends un coups, gère les réactions à ce dernier
}

export default RiftChargePassive;