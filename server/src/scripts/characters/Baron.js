import Characters from "../Character.js";

//import des debuffs du personnage
import LowArmor from "../debuffs/LowArmor.js";
import LowSpeed from "../debuffs/LowSpeed.js";
import LowStrength from "../debuffs/LowStrength.js";

//import des sorts du personnage
import ProfaneRake from "../spells/ProfaneRake.js";
import SanguineBite from "../spells/SanguineBite.js";
import sanguineOffering from "../spells/SanguineOffering.js";
import Exsanguinate from "../spells/Exsanguinate.js";

//import des états négatifs du personnage
import Bleed from "../negativesEffects/Bleed.js";
import Burn from "../negativesEffects/Burn.js";
import Freeze from "../negativesEffects/Freeze.js";
import Poison from "../negativesEffects/Poison.js";
import Slow from "../negativesEffects/Slow.js";
import Stun from "../negativesEffects/Stun.js";


class Baron extends Characters {
    constructor(name) {
        const charData = {
            name: name,
            className: "Baron",
            typeName: "Monster",
            image: "/images/characters/monsters/boss/baron/baron.png",
            description: "Baron is a strong boss using powerfull strikes and bleedings",
            avatar: "/images/characters/monsters/boss/baron/avatars/baron_avatar.png",
            statistics: {
                hp: 4500,
                str: 240,
                arm: 50,
                speed: 30,
                critChance: 0.2,
                critDamage: 1.5
            },
            baseStatistics: {
                hp: 4500,
                str: 240,
                arm: 50,
                speed: 30,
                critChance: 0.2,
                critDamage: 1.5
            },
            passives: [],
            buffs: [],
            debuffs: [new LowArmor(), new LowSpeed(), new LowStrength()],
            negativeEffects: [new Bleed(), new Burn(), new Freeze(), new Poison(), new Slow(), new Stun()],
            spells: [new ProfaneRake(), new SanguineBite(), new sanguineOffering(), new Exsanguinate()],
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

export default Baron;