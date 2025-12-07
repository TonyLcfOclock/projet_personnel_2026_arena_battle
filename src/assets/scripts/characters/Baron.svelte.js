import Characters from "../Character.svelte.js";

//import des sorts du personnage
import ProfaneRake from "../spells/ProfaneRake.svelte.js";
import SanguineBite from "../spells/SanguineBite.svelte.js";
import sanguineOffering from "../spells/SanguineOffering.svelte.js";
import Exsanguinate from "../spells/Exsanguinate.svelte.js";

//import des états négatifs du personnage
import Bleed from "../negativesEffects/Bleed.svelte.js";
import Burn from "../negativesEffects/Burn.svelte.js";
import Freeze from "../negativesEffects/Freeze.svelte.js";
import Poison from "../negativesEffects/Poison.svelte.js";
import Slow from "../negativesEffects/Slow.svelte.js";
import Stun from "../negativesEffects/Stun.svelte.js";


class Baron extends Characters {
    constructor(name) {
        const charData = {
            name: name,
            image: "./src/assets/art/characters/monsters/boss/baron.png",
            statistics: {
                HP: 4500,
                maxHP: 4500,
                STR: 240,
                ARM: 50,
                speed: 90,
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