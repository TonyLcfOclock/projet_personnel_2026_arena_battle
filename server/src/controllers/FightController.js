import DeathKnight from '../scripts/characters/DeathKnight.js';
import Baron from '../scripts/characters/Baron.js';
import Fight from '../scripts/utils/Fight.js';

class FightController {

    initialiseBattle(req, res) {
        const fight = new Fight('Test Fight');

        const player = new DeathKnight('Verso');
        const enemy = new Baron('Baron');
        const log = {
            text: `Un combat est engagé entre ${player.name} et ${enemy.name} !`,
            styles: [],
        }
        const battle = [player, enemy, fight.fightName, log];

        res.status(200).json(battle);
    }
    
    calculateCharacterHitChance(speed) {
        return Math.floor(Math.random() * speed);
    }

    chooseCharacterHitTurn(req, res) {
        let objs = req.body;
        console.log(objs)
        res.status(200).json(true);
    }
}

export default new FightController();