import { Battle } from '../models/Battle.js';
import crypto from 'crypto';

class BattleStore {
    async createBattle(playerCharacter, enemyCharacter) {
        const id = crypto.randomUUID();

        const player = playerCharacter;
        const enemy = enemyCharacter;

        const data = { player, enemy }

        const battle = await Battle.create({
            battleId: id,
            state: "running",
            turn: 1,
            data: JSON.stringify(data)
        })

        return { id };
    }
    
    async getBattle(id) {
        const battle = await Battle.findOne({ where: { battleId: id } });
        const { battleId, state, turn, data } = battle.dataValues;

        return { battleId, state, turn, data: JSON.parse(data) };
    }
}

export default new BattleStore;