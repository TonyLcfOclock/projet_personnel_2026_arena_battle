import Characters from "../Character.js";

// import des passifs du personnage
import RiftChargePassive from "../passives/RiftChargePassive.js";

// import des sorts du personnage
import SpatialShear from "../spells/SpatialShear.js";

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
                HP: 2400,
                maxHP: 2400,
                STR: 220,
                ARM: 85,
                speed: 62,
                CritChance: 0.2,
                CritDamage: 1.8
            },
            passives: [new RiftChargePassive()],
            buffs: [],
            negativeEffects: [new Bleed(), new Burn(), new Freeze(), new Poison(), new Slow(), new Stun()],
            spells: [new SpatialShear()],
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
            const staks = rift.stacks >= 80 ? 80 : rift.stacks;

            damage = Math.round(damage - ((damage * staks) / 100));
        }
        
        this.statistics.HP -= damage;

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