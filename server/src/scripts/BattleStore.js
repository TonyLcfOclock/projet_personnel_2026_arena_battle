import Fight from './utils/Fight.js';
import crypto from 'crypto';

class BattleStore {
    battles = new Map();

    createBattle(playerCharacter, enemyCharacter) {
        const id = crypto.randomUUID();

        const player = playerCharacter;
        const enemy = enemyCharacter
        const fight = new Fight('Test Fight');

        this.battles.set(id, { id, player, enemy, fight});
        return this.battles.get(id);
    }
    
    getBattle(id) {
        return this.battles.get(id) ?? null;
    }

    deleteBattle(id) {
        this.battles.delete(id);
    }
}

export default new BattleStore();