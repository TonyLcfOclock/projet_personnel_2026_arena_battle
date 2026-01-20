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
            headers: {
                "Content-Type": "application/json",
                'x-csrf-token': localStorage.getItem('csrfToken') || '',    
            },
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
            headers: {
                "Content-Type": "application/json",
                'x-csrf-token': localStorage.getItem('csrfToken') || '',    
            },
            body: JSON.stringify(data),
        });

        const toPlay = await res.json();
        return toPlay;
    }

    async checkCharacterNegativeEffectStates(data, name) {
        const { id, username, currentBattle } = data;

        const res = await fetch('/api/battle/check-character-negative-effect', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'x-csrf-token': localStorage.getItem('csrfToken') || '',    
            },
            body: JSON.stringify({ id, username, currentBattle, name }),
        });

        const obj = await res.json();
        return obj;
    }

    async refreshCharacterBuff(data, name) {
        const { id, username, currentBattle } = data;

        const res = await fetch('/api/battle/check-character-buffs', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'x-csrf-token': localStorage.getItem('csrfToken') || '',    
            },
            body: JSON.stringify({ id, username, currentBattle, name }),
        });
        
        const char = await res.json();

        return char;
    }

    async refreshCharacterDebuff(data, name) {
        const { id, username, currentBattle } = data;

        const res = await fetch('/api/battle/check-character-debuffs', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'x-csrf-token': localStorage.getItem('csrfToken') || '',    
            },
            body: JSON.stringify({ id, username, currentBattle, name }),
        });
        
        const char = await res.json();

        return char;
    }

    async passivePerTurn(data, targetName, selfName) {
        const { id, username, currentBattle } = data;

        const res = await fetch('/api/battle/passive-per-turn', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'x-csrf-token': localStorage.getItem('csrfToken') || '',    
            },
            body: JSON.stringify({ id, username, currentBattle, targetName, selfName }),
        });

        const char = await res.json();
        return char;
    }

    async actionToDo(data, actionName, targetName, selfName, turn) {
        if (!actionName) return;

        const { id, username, currentBattle } = data;
        
        const res = await fetch('/api/battle/character-use-spell', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'x-csrf-token': localStorage.getItem('csrfToken') || '',    
            },
            body: JSON.stringify({ id, username, currentBattle, actionName, targetName, selfName, turn }),
        });

        const obj = await res.json();

        return obj;
    }

    async randomAction(data, selfName) {
        const { id, username, currentBattle } = data;

        const res = await fetch('/api/battle/determine-enemy-action', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'x-csrf-token': localStorage.getItem('csrfToken') || '',    
            },
            body: JSON.stringify({ id, username, currentBattle, selfName }),
        });

        const action = await res.json();

        return action;
    }

    async checkCharacterAlive(data, name) {
        const { id, username, currentBattle } = data;

        const res = await fetch('/api/battle/check-character-alive', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'x-csrf-token': localStorage.getItem('csrfToken') || '',    
            },
            body: JSON.stringify({ id, username, currentBattle, name }),
        });

        const response = await res.json();

        return response;
    }
}

export default Fight;