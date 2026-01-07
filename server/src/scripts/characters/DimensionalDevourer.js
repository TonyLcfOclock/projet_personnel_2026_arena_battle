import Characters from "../Character.js";

// import des passifs du personnage
import RiftChargePassive from "../passives/RiftChargePassive.js";

//import des buffs du personnage
import HighSpeed from "../buffs/HighSpeed.js";

//import des debuffs du personnage
import LowArmor from "../debuffs/LowArmor.js";
import LowSpeed from "../debuffs/LowSpeed.js";
import LowStrength from "../debuffs/LowStrength.js";

// import des sorts du personnage
import SpatialShear from "../spells/SpatialShear.js";
import RiftTalon from "../spells/RiftTalon.js";
import VoidstepAssault from "../spells/VoidstepAssault.js";

// import des états négatifs du personnage
import Bleed from "../negativesEffects/Bleed.js";
import Burn from "../negativesEffects/Burn.js";
import Freeze from "../negativesEffects/Freeze.js";
import Poison from "../negativesEffects/Poison.js";
import Slow from "../negativesEffects/Slow.js";
import Stun from "../negativesEffects/Stun.js";

class DimensionalDevourer extends Characters {
    constructor(name) {
        const charData = {
            name: name,
            className: "Dimensional Devourer",
            typeName: "Monster",
            image: "/images/characters/monsters/boss/dimensional_devourer/dimensional_devourer.png",
            description: "An apex aberration that tears reality, steals tempo, and banishes targets between dimensions. Its powers weaken when Anchored.",
            avatar: "/images/characters/monsters/boss/dimensional_devourer/avatars/dimensional_devourer.png",
            statistics: {
                hp: 2400,
                str: 220,
                arm: 85,
                speed: 62,
                critChance: 0.1,
                critDamage: 1.8
            },
            baseStatistics: {
                hp: 2400,
                str: 220,
                arm: 85,
                speed: 62,
                critChance: 0.1,
                critDamage: 1.8
            },
            passives: [new RiftChargePassive()],
            buffs: [new HighSpeed()],
            debuffs: [new LowArmor(), new LowSpeed(), new LowStrength()],
            negativeEffects: [new Bleed(), new Burn(), new Freeze(), new Poison(), new Slow(), new Stun()],
            spells: [new SpatialShear(), new RiftTalon(), new VoidstepAssault()],
        };

        super(charData);
    }

    perTurn(target, self) {
        this.passives.forEach(passive => {
            passive.onTurn(target, self);
        })
    }

    perHit(target, self, damage) {
        const log = [];

        const rift = this.passives.find(element => element.name === 'Rift Charge');

        if (rift) {
            const stacks = rift.stacks >= 80 ? 80 : rift.stacks;

            damage = Math.round(damage - ((damage * stacks) / 100));
        }
        
        this.statistics.hp -= damage;

        this.passives.forEach(passive => {
            let p = passive.onHit(target, self);
            
            if (p) {
                log.push(p);
            }
        })

        return { damage, log };
    }
}

export default DimensionalDevourer;