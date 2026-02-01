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
        const res = await fetch(`/api/battle/${data.currentBattle}/reduce-character-spells-cd`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                'x-csrf-token': localStorage.getItem('csrfToken') || '',    
            },
            body: JSON.stringify({ name }),
        });

        const char = await res.json();
        return char;
    }

    canPlayTurn(character) {
        const stunEffect = character.negativeEffects.find(negate => negate.name === "Stun");
        return !stunEffect.state;
    }

    async getCharacterHitTurn(data) {
        const res = await fetch(`/api/battle/${data.currentBattle}/turn/`);

        const toPlay = await res.json();
        return toPlay;
    }

    async checkCharacterNegativeEffectStates(data, name) {
        const res = await fetch(`/api/battle/${data.currentBattle}/check-character-negative-effect`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                'x-csrf-token': localStorage.getItem('csrfToken') || '',    
            },
            body: JSON.stringify({ name }),
        });

        const obj = await res.json();
        return obj;
    }

    async refreshCharacterBuff(data, name) {
        const res = await fetch(`/api/battle/${data.currentBattle}/check-character-buffs`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                'x-csrf-token': localStorage.getItem('csrfToken') || '',    
            },
            body: JSON.stringify({ name }),
        });
        
        const char = await res.json();

        return char;
    }

    async refreshCharacterDebuff(data, name) {
        const res = await fetch(`/api/battle/${data.currentBattle}/check-character-debuffs`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                'x-csrf-token': localStorage.getItem('csrfToken') || '',    
            },
            body: JSON.stringify({ name }),
        });
        
        const char = await res.json();

        return char;
    }

    async passivePerTurn(data, targetName, selfName) {
        const res = await fetch(`/api/battle/${data.currentBattle}/passive-per-turn`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                'x-csrf-token': localStorage.getItem('csrfToken') || '',    
            },
            body: JSON.stringify({ targetName, selfName }),
        });

        const char = await res.json();
        return char;
    }

    async actionToDo(data, actionName, targetName, selfName, turn) {
        if (!actionName) return;

        const res = await fetch(`/api/battle/${data.currentBattle}/character-use-spell`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                'x-csrf-token': localStorage.getItem('csrfToken') || '',    
            },
            body: JSON.stringify({ actionName, targetName, selfName, turn }),
        });

        const obj = await res.json();

        return obj;
    }

    async randomAction(data, name) {
        const res = await fetch(`/api/battle/${data.currentBattle}/determine-enemy-action?name=${name}`);

        const action = await res.json();

        return action;
    }

    async checkCharacterAlive(data, name) {
        const res = await fetch(`/api/battle/${data.currentBattle}/check-character-alive`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                'x-csrf-token': localStorage.getItem('csrfToken') || '',    
            },
            body: JSON.stringify({ name, userId: data.id }),
        });

        const response = await res.json();

        return response;
    }
}

export default Fight;