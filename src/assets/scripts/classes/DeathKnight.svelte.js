import CounterStrike from "../buffs/CounterStrike";
import Characters from "../Character.svelte.js";
import Bleed from "../negativesEffects/Bleed.svelte.js";
import Burn from "../negativesEffects/Burn.svelte.js";
import Freeze from "../negativesEffects/Freeze.svelte.js";
import Poison from "../negativesEffects/Poison.svelte.js";
import Slow from "../negativesEffects/Slow.svelte.js";
import Stun from "../negativesEffects/Stun.svelte.js";
import CounterStrikePassive from "../passives/CounterStrikePassive.svelte.js";
import SoulsScalingPassive from "../passives/SoulsScalingPassive.svelte.js";
import PhantomBacklash from "../spells/PhantomBacklash.svelte";
import PiercingStrike from "../spells/PiercingStrike.svelte.js";
import SpectralStrike from "../spells/SpectralStrike.svelte.js";

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
            buffs: [new CounterStrike()],
            negativeEffects: [new Bleed(), new Burn(), new Freeze(), new Poison(), new Slow(), new Stun()],
            spells: [
                new PiercingStrike(),
                new SpectralStrike(),
                new PhantomBacklash()
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