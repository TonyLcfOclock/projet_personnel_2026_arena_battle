import CounterStrike from "../buffs/CounterStrike.js";
import HighSpeed from "../buffs/HighSpeed.js";
import Characters from "../Character.svelte.js";
import Bleed from "../negativesEffects/Bleed.js";
import Burn from "../negativesEffects/Burn.js";
import Freeze from "../negativesEffects/Freeze.js";
import Poison from "../negativesEffects/Poison.js";
import Slow from "../negativesEffects/Slow.js";
import Stun from "../negativesEffects/Stun.js";
import CounterStrikePassive from "../passives/CounterStrikePassive.js";
import SoulsScalingPassive from "../passives/SoulsScalingPassive.js";
import Overpower from "../spells/Overpower.js";
import PhantomBacklash from "../spells/PhantomBacklash.js";
import PiercingStrike from "../spells/PiercingStrike.js";
import SoulHarvest from "../spells/SoulHarvest.js";
import SpectralStrike from "../spells/SpectralStrike.js";

class DeathKnight extends Characters {
    constructor(name) {
        const charData = {
            name: name,
            image: "./src/assets/art/characters/humans/classes/death_knight/death_knight1.png",
            statistics: {
                HP: 800,
                maxHP: 800,
                STR: 150,
                ARM: 60,
                speed: 50,
                CritChance: 0.2,
                CritDamage: 1.5
            },
            selfAttributes: {
                Souls: 0,
            },
            passives: [new SoulsScalingPassive(), new CounterStrikePassive()],
            buffs: [new CounterStrike(), new HighSpeed()],
            negativeEffects: [new Bleed(), new Burn(), new Freeze(), new Poison(), new Slow(), new Stun()],
            spells: [
                new PiercingStrike(),
                new SpectralStrike(),
                new PhantomBacklash(),
                new Overpower(),
                new SoulHarvest(),
            ],
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

export default DeathKnight;