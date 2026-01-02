class Fight {
    fightingLogs = $state([]);
    
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

    async reduceCharactersSpellsCooldown(data, name) {
        const { id, username, currentBattle } = data;

        const res = await fetch('/api/battle/reduce-character-spells-cd', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, username, currentBattle, name}),
        });

        const char = await res.json();
        return char;
    }

    canPlayTurn(character) {
        const stunEffect = character.negativeEffects.find(negate => negate.name === "Stun");
        return !stunEffect.state;
    }

    async getCharacterHitTurn(data) {
        const res = await fetch("/api/battle/turn/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const toPlay = await res.json();
        return toPlay;
    }

    async checkCharacterNegativeEffectStates(data, name) {
        const { id, username, currentBattle } = data;

        const res = await fetch('/api/battle/check-character-negative-effect', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, username, currentBattle, name }),
        });

        const obj = await res.json();
        return obj;
    }

    async refreshCharacterBuff(data, name) {
        const { id, username, currentBattle } = data;

        const res = await fetch('/api/battle/check-character-buffs', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, username, currentBattle, name }),
        });
        
        const char = await res.json();

        return char;
    }

    async passivePerTurn(data, targetName, selfName) {
        const { id, username, currentBattle } = data;

        const res = await fetch('/api/battle/passive-per-turn', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, username, currentBattle, targetName, selfName }),
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