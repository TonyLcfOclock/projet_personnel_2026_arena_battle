import Characters from "../Character.js";

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
            image: "./src/assets/art/characters/monsters/boss/baron.png",
            description: "Baron is a strong boss using powerfull strikes and bleedings",
            avatar: "",
            statistics: {
                HP: 4500,
                maxHP: 4500,
                STR: 240,
                ARM: 50,
                speed: 30,
                CritChance: 0.2,
                CritDamage: 1.5
            },
            selfAttributes: {},
            passives: [],
            buffs: [],
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

    perHit(target, self, fightInstance) {
        this.passives.forEach(passive => {
            passive.onHit(target, self, fightInstance);
        })
    }
}

export default Baron;