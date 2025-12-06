import Spell from "../Spell.svelte.js";

class PhantomBacklash extends Spell {
    constructor(spellData) {
        super(spellData);
    }

    logSpellAction(target, self, damage, fightInstance) {
        fightInstance.addLogsLine({
            text: `${self.name} utilise Phantom Backlash et se prépare à riposter pendant 2 tours`,
            styles:
                [
                    { word: `Phantom`, color: 'grey' },
                    { word: `Backlash`, color: 'grey' },
                    { word: `riposter`, color: 'orange' },
                    { word: `2`, color: 'green' }
                ]
        });
    }

    canUseSpell(caster, target) {
        return this.currentCooldown === 0 && caster.buffs[0].isActive === false;
    }

    useSpell(target, self, fightInstance) {
        let damage = 0;
        this.currentCooldown = this.cooldown;
        self.buffs[0].applyBuff();

        this.logSpellAction(target, self, damage, fightInstance);
    }
}

export default PhantomBacklash;