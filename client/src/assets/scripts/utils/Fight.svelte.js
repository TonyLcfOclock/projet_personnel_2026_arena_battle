import Utilities from "./Utilities.svelte.js";

class Fight {
    fightingLogs = $state([]);

    constructor(name) {
        this.fightName = name;
    }
    
    addLogsLine(obj) {
        this.fightingLogs.push(obj);
    }

    buildLogsText(line) {
        const parts = line.text.split(/(\s+)/);

        return parts.map((part) => {
            const clean = part.replace(/[.,!?;:()"']/g, '');

            const style = line.styles.find(v => v.word === clean);
            return {
                text: part,
                style: style ? `color: ${style.color}; font-weight: bold` : ''
            }
        })
    }

    async reduceCharactersSpellsCooldown(battleId, name) {
        let obj = { id: battleId, name}
        const res = await fetch('/api/battle/reduce-character-spells-cd', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(obj),
        });

        const char = await res.json();

        return char;
    }

    canPlayTurn(character) {
        const stunEffect = character.negativeEffects.find(negate => negate.name === "Stun");
        return !stunEffect.state;
    }

    async getCharacterHitTurn(battleId) {
        const res = await fetch("/api/battle/turn/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: battleId }),
        });

        const toPlay = await res.json();
        return toPlay;
    }

    async checkCharacterNegativeEffectStates(battleId, name) {
        const res = await fetch('/api/battle/check-character-negative-effect', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id: battleId, name}),
        });

        const obj = await res.json();
        return obj;
    }

    async refreshCharacterBuff(battleId, name) {
        const res = await fetch('/api/battle/check-character-buffs', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id: battleId, name}),
        });
        
        const char = await res.json();

        return char;
    }

    async passivePerTurn(battleId, targetName, selfName) {
        const res = await fetch('/api/battle/passive-per-turn', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id: battleId, targetName, selfName}),
        });

        const char = await res.json();
        return char;
    }

    async actionToDo(battleId, actionName, targetName, selfName) {
        if (!actionName) return;
        
        const res = await fetch('/api/battle/character-use-spell', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id: battleId, actionName, targetName, selfName}),
        });

        const obj = await res.json();

        return obj;
    }

    async randomAction(battleId, selfName, targetName) {

         const res = await fetch('/api/battle/determine-enemy-action', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id: battleId, selfName, targetName}),
        });

        const action = await res.json();

        return action;
    }
}

export default Fight;